import React, { Component } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import moment from "moment";
import ReactPaginate from "react-paginate";


interface ArticleShort {
  id: number;
  sentiment_score: number;
  date: string;
}
interface WordScore {
  word: string;
  tfidf_score: number;
  sentiment: number;
}

interface Article {
  id: number;
  journal: string;
  title: string;
  date: string;
  content: string;
  sentiment_score: number;
  word_scores: WordScore[];
  expanded: boolean;
}

interface SentimentRange {
  0: number;
  1: number;
}

interface ArticleViewerProps {
  articles: ArticleShort[];
  sentimentRange: SentimentRange;
}

interface ArticleViewerState {
  nrArticlesDisplay: number;
  currentPage: number;
  articles: Article[]
  articleContentLimit: number;
  fetchingAPI: boolean;
  word_score_treshold: number;
}

class ArticleViewer extends Component<ArticleViewerProps, ArticleViewerState> {
  constructor(props: ArticleViewerProps) {
    super(props);

    this.state = {
      nrArticlesDisplay: 3,
      currentPage: 0,
      articles: [],
      articleContentLimit: 500,
      fetchingAPI: true,
      word_score_treshold: 0.25,
    };
  }

  handlePageClick = (data: { selected: number }) => {
    this.setState({ currentPage: data.selected });
  };

  handleExpandContent(article: Article) {
    const updatedArticles = this.state.articles.map((a) => {
      if (a.id === article.id) {
        return { ...a, expanded: !a.expanded };
      } else {
        return a;
      }
    });

    this.setState({ articles: updatedArticles });
  }


  fetchArticleData() {
    this.setState({ fetchingAPI: true });

    const articleIds: number[] = this.props.articles
      .filter(x => x.sentiment_score * 100 >= this.props.sentimentRange[0] &&
        x.sentiment_score * 100 <= this.props.sentimentRange[1])
      .map(x => x.id);

    const url = "http://localhost:5000/articles";
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: articleIds })
    };

    let articles: Article[] = [];

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        articles = data.filter((x: Article) => articleIds.includes(x.id)).map((x: Article) => {
          return { ...x, expanded: false };
        }).sort((a: Article, b: Article) => moment(a.date).diff(moment(b.date)));
        this.setState({ articles: articles, fetchingAPI: false });
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
        this.setState({ fetchingAPI: false });
      });
  }


  componentDidMount() {
    // Fetch data from API based on selected article indexes.
    this.fetchArticleData();
  }

  componentDidUpdate(prevProps: ArticleViewerProps) {
    if (prevProps.sentimentRange !== this.props.sentimentRange) {
      this.fetchArticleData();
    }
  }

  render() {
    const { articles, currentPage } = this.state;

    const startIndex = currentPage * this.state.nrArticlesDisplay;
    const endIndex = startIndex + this.state.nrArticlesDisplay;

    const displayedArticles = articles.slice(startIndex, endIndex);

    const sentimentColor = (score: number) => {
      if (score > 0) {
        return `linear-gradient(to bottom, #8BC34A, #4CAF50)`;
      } else if (score < 0) {
        return `linear-gradient(to bottom, #F44336, #D32F2F)`;
      } else {
        return `linear-gradient(to bottom, #BDBDBD, #9E9E9E)`;
      }
    };

    const formatArticleContent = (content: string, limit: number,
      wordScores: WordScore[], wordScoreThreshold: number) => {
      const words = content.substring(0, limit).split(" ");
      return words.map((word, index) => {
        const tfidfScore = wordScores[index]?.tfidf_score;
        if (tfidfScore && tfidfScore > wordScoreThreshold) {
          return <span key={index} style={{ fontWeight: "bold" }}>{word} </span>;
        }
        return `${word} `;
      });
    };

    return (
      <Grid container spacing={2}>
        {this.state.fetchingAPI ? (
          <Grid item xs={12}>
            <Grid container justifyContent="center" alignContent="center">
              <CircularProgress size={100} />
            </Grid>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Grid container justifyContent="center" alignContent="center">
              {displayedArticles.length > 0 ? (
                <Grid item>
                  <Grid container spacing={3} style={{ display: "flex", flexDirection: "row" }}>
                    {displayedArticles.map((article) => (
                      <Grid item xs={12} sm={6} md={4} key={article.id}>
                        <Card style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          background: sentimentColor(article.sentiment_score)
                        }}>
                          <CardHeader
                            title={article.title}
                            subheader={article.journal}
                          />
                          <CardContent>
                            <Typography variant="body2" component="p" style={{ margin: "0" }}>
                              {article.expanded
                                ? formatArticleContent(article.content, article.content.length, article.word_scores, this.state.word_score_treshold)
                                : formatArticleContent(article.content, this.state.articleContentLimit, article.word_scores, this.state.word_score_treshold)}
                              {article.content.length > this.state.articleContentLimit && (
                                <span
                                  style={{ color: "blue", cursor: "pointer" }}
                                  onClick={() => this.handleExpandContent(article)}
                                >
                                  {article.expanded ? "...Show less" : "...Show more"}
                                </span>
                              )}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <ReactPaginate
                    pageCount={Math.ceil(
                      articles.length / this.state.nrArticlesDisplay
                    )}
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={1}
                    onPageChange={this.handlePageClick}
                    containerClassName="pagination"
                    activeClassName="active"
                    pageClassName="page-link"
                    previousClassName="prev-link"
                    nextClassName="next-link"
                  />
                </Grid>
              ) : (
                <Grid item>
                  <Typography variant="h6" align="center">
                    No data to display.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  }

}

export default ArticleViewer;
