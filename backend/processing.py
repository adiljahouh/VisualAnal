import pandas as pd
from textblob import TextBlob
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.tokenize import sent_tokenize


def initialize_data():
    articles_df = pd.read_csv('results/articles_clean.csv')
    articles_df['date'] = pd.to_datetime(articles_df['date'], errors='coerce')
    articles_df.dropna(inplace=True)
    articles_df['id'] = articles_df.index + 1

    # Calculate sentiment scores using TextBlob
    sentiment_scores = []
    for content in articles_df['content']:
        blob = TextBlob(content)
        sentiment_scores.append(blob.sentiment.polarity)
    articles_df['sentiment_score'] = sentiment_scores

    mails_df = pd.read_csv('results/mails_clean.csv')

    return articles_df, mails_df


def process(df, n_clusters=3, n_top=10, start=None, end=None):
    if start != None:
        ts = pd.to_datetime(start).to_numpy()
        df = df[df['date'] >= ts]
    if end != None:
        ts = pd.to_datetime(end).to_numpy()
        df = df[df['date'] <= ts]

    # Vectorize the content column using TF-IDF
    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform(df['content'])

    # Perform k-means clustering
    kmeans = KMeans(n_clusters=n_clusters,
                    random_state=0, n_init='auto').fit(X)

    # Get the cluster assignments for each data point
    labels = kmeans.labels_

    # Create a new column in the dataframe with the cluster assignments
    df['cluster'] = labels

    # Group the dataframe by cluster and get the list of articles for each cluster
    cluster_articles = df.groupby('cluster')[['id', 'journal', 'title', 'date', 'sentiment_score']].apply(
        lambda x: x.to_dict('records')).to_dict()

    # Create a list of tuples with each word and its corresponding index
    feature_names = vectorizer.get_feature_names_out()

    # Get the cluster centers
    cluster_centers = kmeans.cluster_centers_

    data = {'n_clusters': n_clusters, 'n_top': n_top, 'clusters': []}

    # For each cluster center, print the top 10 words with their corresponding TF, IDF, and TF-IDF scores
    for i in range(n_clusters):
        cluster = {'cluster': i, 'articles': cluster_articles[i], 'words': []}
        center = cluster_centers[i]
        if n_top < len(center):
            top_indices = center.argsort()[-n_top:][::-1]
        else:
            top_indices = center.argsort()[:][::-1]
        for _, index in enumerate(top_indices):
            word = feature_names[index]
            tf = center[index]
            idf = vectorizer.idf_[index]
            tf_idf = tf * idf
            total_freq = X[:, index].sum()
            cluster['words'].append({
                'word': word,
                'importance': tf_idf,
                'frequency': total_freq.item()
            })
        data['clusters'].append(cluster)

    return data


def summarize_text(content, n_sentences=3):
    # Tokenize the content into sentences
    sentences = sent_tokenize(content)

    # Create a TfidfVectorizer object
    tfidf = TfidfVectorizer()

    # Fit the vectorizer to the sentences
    tfidf_matrix = tfidf.fit_transform(sentences)

    # Calculate the average TF-IDF score for each sentence
    sentence_scores = tfidf_matrix.mean(axis=1).flatten()

    # Get the indices of the highest-scoring sentences
    top_sentence_indices = sentence_scores.argsort()[-n_sentences:][::-1]

    # Get the highest-scoring sentences
    summary_sentences = [sentences[i] for i in top_sentence_indices]

    # Join the sentences into a summary
    summary = ' '.join(summary_sentences)

    return summary


def score_words(content):
    # Create a TfidfVectorizer object
    tfidf = TfidfVectorizer()

    # Fit the vectorizer to the text
    tfidf_matrix = tfidf.fit_transform([content])

    # Get the feature names (i.e., the words)
    feature_names = tfidf.get_feature_names_out()

    # Get the TF-IDF scores for each word
    scores = tfidf_matrix.toarray().flatten()

    # Create a dictionary of words and their corresponding scores
    scored_words = dict(zip(feature_names, scores))

    # Tokenize the text
    tokens = content.split()

    # Score each token based on its TF-IDF score
    scored_tokens = [(w, scored_words.get(w.lower(), 0)) for w in tokens]

    return scored_tokens


def get_articles(df, id=None, journal=None, title=None, start=None, end=None, n_sentences=3):
    if id != None:
        df = df[df['id'] == id]
    if journal != None:
        df = df[df['journal'].str.contains(journal)]
    if title != None:
        df = df[df['title'].str.contains(title)]
    if start != None:
        ts = pd.to_datetime(start).to_numpy()
        df = df[df['date'] >= ts]
    if end != None:
        ts = pd.to_datetime(end).to_numpy()
        df = df[df['date'] <= ts]

    results = []
    for _, row in df.iterrows():
        result = {
            'id': row['id'],
            'journal': row['journal'],
            'title': row['title'],
            'date': row['date'],
            'content': row['content'],
            'sentiment_score': row['sentiment_score'],
            # 'summary': summarize_text(row['content'], n_sentences),
            'word_scores': score_words(row['content'])
        }
        results.append(result)

    return results


def filter_mails(df, weight=10, sender=['Sven Flecha'], width=4, data=None,
                 blacklist=[], start=None, end=None):
    """
    Returns a list of lists, where the mails sent from the people in the sender list are filtered by weight and are all between
    start_date and end_date. Note that the only goal of this visualization is to show frequency of mails sent between people within a timezone.
    """
    if start != None:
        ts = pd.to_datetime(start).to_numpy()
        df = df[df['Date'] >= ts]
    if end != None:
        ts = pd.to_datetime(end).to_numpy()
        df = df[df['Date'] <= ts]
    subset = df[df['From'].isin(sender)]
    removed_cycle = subset[subset['From'] != subset['To']]
    sankey_format_df = removed_cycle.groupby(
        ['From', 'To'], as_index=False)['Subject'].count()
    sankey_format_df = sankey_format_df[sankey_format_df['Subject'] > weight]
    sankey_format_df.rename(columns={'Subject': 'Weight'}, inplace=True)

    new_blacklist = sankey_format_df['From'].unique().tolist() + blacklist
    sankey_format_df = sankey_format_df[~sankey_format_df['To'].isin(
        new_blacklist)]

    values_list = sankey_format_df.values.tolist()

    if data is not None:
        values_list = data + values_list

    if width > 0:
        values_list = filter_mails(df=df, weight=weight, sender=sankey_format_df['To'].unique(), width=width-1,
                                   data=values_list, blacklist=new_blacklist, start=start, end=end)
        return values_list
    else:
        columns_list = sankey_format_df.columns.values.tolist()
        values_list = [columns_list] + values_list
        return values_list


def get_mail_names(df, start=None, end=None):
    if start != None:
        ts = pd.to_datetime(start).to_numpy()
        df = df[df['Date'] >= ts]
    if end != None:
        ts = pd.to_datetime(end).to_numpy()
        df = df[df['Date'] <= ts]

    return df['From'].unique().tolist()
