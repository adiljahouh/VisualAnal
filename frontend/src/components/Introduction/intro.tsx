import React, { Component } from "react";
class IntroPage extends Component {
  render() {
    return (
      <div>
        <p>
          This is a project for the course "Data Visualization" at the Technical
          University of Eindhoven. The goal of this report is to aid in the
          investigation of multiple missing person reports on the fictional
          island of Kronos.
        </p>
        <div>
          <p>
            The data used in this project is based on the fictional island of
            Kronos. To use the dashboard, use the navigation bar to the left to
            head to one of the visualizations. All visualizations include a date
            range slider at the top. This allows the user to select a date range
            to filter the data on.
          </p>
          <p>
            The TreeMap shows a clustering of articles and depicts the most main
            important word of these cluster of articles. Hover over each node to
            see the importance of this word and click on the node to see the
            articles that are clustered in this node. The articles are able to
            be filtered on sentiment to gain knowledge about negative, neutral
            and positive articles with this specific word or topic.
          </p>
          <p>
            The Sankey diagram shows the flow of mails from one topic to
            another. The Sankey diagram is interactive and can be filtered on
            sender, weight (how many mails need to be sent to include that
            specific flow) and width (how far in the chain of sender and
            receiver do we look). Hovering over each flow will show the amount
            of mails that are sent as weight and the sender and receiver of the
            mail.
          </p>
        </div>
      </div>
    );
  }
}
export default IntroPage;
