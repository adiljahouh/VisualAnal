import React, { useContext, useState, useEffect, Suspense } from 'react';
import { ApiDataContext } from '../Context/ApiDataContext/ApiDataContext';
import { DateContext } from '../Context/DateContext/DateContext';

 

const Card = ({ articleId }) => {
  const [articleData, setArticleData] = useState(null);

  useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`http://127.0.0.1:5000/articles?id=${articleId}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        setArticleData(data[0]);
      })
      .catch(error => {
        console.log('Error fetching article data:', error);
      });
  }, [articleId]);

  if (!articleData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cardContainer">
      <DateStamp timeCreated={new Date(Date.parse(articleData.date))} colorTheme={'orange'} />
      <Category category={`Sentiment score: ${articleData.sentiment_score}`} colorTheme={'orange'}/>
      <TextBlock content={articleData.content} title={articleData.title}/>
    </div>
  );
};

const Category = ( { colorTheme, category} ) => {
    return (
        <div className="category">
          <span style={{backgroundColor: colorTheme}}><strong>{category}</strong></span>
        </div>
      )
  };

  
const DateStamp = ( { timeCreated, colorTheme } ) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const date = timeCreated.getDate();
  const monthNum = timeCreated.getMonth();
  const month = months[monthNum];

  return (
    <div style={{backgroundColor: colorTheme}} className="dateStamp">
      <div className="day"> {date} </div>
      <div className="month"> {month} </div>
    </div>
  )  
};
  
  
const TextBlock = (  { content, title } ) => {
  return (
    <div className="textBlock">
      <h1>{title}</h1>
      {/* <h2 style={{color: colorTheme}}>{subheading}</h2> */}
      <div className="paragraphContainer">
        <p>{content}</p>
      </div>
    </div>
  )
};
  
  
const ReactNewsCard = ({ cluster, sentimentRange }) => {

    const { newsModalData } = useContext(ApiDataContext);
    const { startDate, endDate } = useContext(DateContext);

    let shownArticles = 0;
  
    const cardNodes = newsModalData[cluster].map((article, index) => {

      if (shownArticles >= 3) {
        return;
        //Don't render articles with sentiment score outside of the range or date outside of the range
      } else if (article.sentiment_score < sentimentRange[0]/100 || article.sentiment_score > sentimentRange[1]/100
              || article.date < startDate.toDate() || article.date > endDate.toDate()) {
        return;
      } else {

        shownArticles += 1;

        return (
          <Suspense key={index} fallback={<div>Loading...</div>}>
            <Card articleId={article.id} />
          </Suspense>
        );
      }      
    });
  
    return (
      <div>
        {cardNodes}
      </div>
    );
};
  

  
export default ReactNewsCard;