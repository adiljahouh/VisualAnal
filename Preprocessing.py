import datefinder
import os
import pandas as pd
import re
import calendar
# from gensim.models import Word2Vec
import string
from nltk import word_tokenize
from nltk.corpus import stopwords
DIR = 'data/articles'


def getArticlesDates(DIRECTORY):
    articlesDates = dict()
    for filename in os.scandir(DIRECTORY):
        if filename.is_file():
            try:
                with open(filename, encoding='ISO-8859-1') as f:
                    matches = datefinder.find_dates(f.read())
                    articlesDates[int(filename.name.replace(
                        ".txt", ""))] = next(matches)
                    f.close()
            except StopIteration:
                print(
                    f"No dates found due to not being able to read {filename.name}")
                with open(filename) as f:
                    matches = datefinder.find_dates(f.read())
                    articlesDates[int(filename.name.replace(".txt", ""))] = next(
                        matches, "Unknown")
                    f.close()
    dfArticles = pd.DataFrame.from_dict(
        articlesDates, orient='index').sort_index()
    dfArticles.columns = ['Date']
    return dfArticles


def cleanText(text, tokenizer, stopwords):
    text = str(text).lower()  # Lowercase words
    text = re.sub(r"\[(.*?)\]", "", text)  # Remove [+XYZ chars] in content
    text = re.sub(r"\s+", " ", text)  # Remove multiple spaces in content
    text = re.sub(r"\w+…|…", "", text)  # Remove ellipsis (and last word)
    text = re.sub(r"(?<=\w)-(?=\w)", " ", text)  # Replace dash between words
    text = re.sub(
        f"[{re.escape(string.punctuation)}]", "", text
    )  # Remove punctuation

    tokens = tokenizer(text)  # Get tokens from text
    tokens = [t for t in tokens if not t in stopwords]  # Remove stopwords
    tokens = ["" if t.isdigit() else t for t in tokens]  # Remove digits
    tokens = [t for t in tokens if len(t) > 1]  # Remove short tokens
    return tokens


def getTokens(DIRECTORY, tokenizer, stopwords):
    tokensDict = dict()
    for filename in os.scandir(DIRECTORY):
        if filename.is_file():
            try:
                with open(filename, encoding='ISO-8859-1') as f:
                    tokens = cleanText(f.read(), tokenizer, stopwords)
            except UnicodeDecodeError:
                print(f"Couldnt read file, retrying.. {filename.name}")
                with open(filename) as f:
                    tokens = cleanText(f.read(), tokenizer, stopwords)
        tokensDict[int(filename.name.replace(".txt", ""))] = tokens
    dfTokens = pd.DataFrame.from_dict(tokensDict, orient='index').sort_index()
    dfTokensClean = pd.get_dummies(
        dfTokens, prefix='', prefix_sep='').max(level=0, axis=1)
    # dfTokens.columns = ['Tokens']
    return dfTokensClean


def preprocessMails(pathInputMails="data/emailheaders.csv", pathInputPersonal='data/EmployeeRecords.xlsx', pathOutput='data/MailsClean.csv'):
    if not os.path.isfile(pathOutput):  # if we didnt preprocess mails yet
        emailData = pd.read_csv(pathInputMails, encoding='cp1252')
        # remove whitespaces, there are a lot in "To"
        emailData['From'] = emailData['From'].str.strip()
        # this is REALLY inefficient but we dont know how we want to preprocess everything yet..
        personalData = pd.read_excel(
            pathInputPersonal)[['EmailAddress', 'FirstName', 'LastName']]
        personalData['FullName'] = personalData['FirstName'] + \
            ' ' + personalData['LastName']
        personalDataClean = personalData[['EmailAddress', 'FullName']]
        nameToMailMapper = pd.Series(
            personalDataClean.FullName.values, index=personalDataClean.EmailAddress).to_dict()  # mapper for names to mails
        # this dude has 2 mails...
        nameToMailMapper.pop("Sten.Sanjorge Jr.@gastech.com.kronos")
        nameToMailMapper["Sten.Sanjorge Jr.@gastech.com.tethys"] = "Sten Sanjorge Jr. Tethys"
        nameToMailMapper["Sten.Sanjorge Jr.@gastech.com.kronos"] = "Sten Sanjorge Jr. Kronos"
        print(nameToMailMapper)
        mappedMails = emailData.replace(
            {'From': nameToMailMapper})
        listifiedEmailData = mappedMails.assign(
            To=mappedMails.To.str.split(','))
        explodedEmailData = listifiedEmailData.explode(
            'To').reset_index(drop=True)
        explodedEmailData['To'] = explodedEmailData['To'].str.strip()
        replacedTo = explodedEmailData.replace(
            {'To': nameToMailMapper})
        print(replacedTo.dtypes)
        replacedTo['Date'] = pd.to_datetime(
            replacedTo['Date'], format='%m/%d/%Y %H:%M')
        replacedTo.to_csv(pathOutput, index=False)


if __name__ == "__main__":
    print("preprocessing.py")

    # removing month names from articles
    calenderList = list(calendar.month_name)
    calenderListClean = [x.lower() for x in calenderList]
    custom_stopwords = set(stopwords.words("english") +
                           ["news", "new", "top"] + calenderListClean)

    dfArticlesDates = getArticlesDates(DIRECTORY=DIR)
    dfTokens = getTokens(DIR, word_tokenize, custom_stopwords)
    preprocessMails(pathInputMails="data/emailheaders.csv",
                    pathInputPersonal='data/EmployeeRecords.xlsx', pathOutput='data/MailsClean.csv')
    # print(dfTokens)
    # print(dfArticlesDates)
