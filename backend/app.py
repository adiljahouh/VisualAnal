from processing import initialize_data, process, get_articles, get_mail_names, filter_mails
from flask import Flask, jsonify, redirect
from flask_restful import Api, Resource, reqparse
from flasgger import Swagger
from flask_cors import CORS


app = Flask(__name__)
api = Api(app)  # Flask restful wraps Flask app around it.
swagger = Swagger(app)
cors = CORS(app)

# Load the pre-processed data from the CSV files
articles_df, mails_df = initialize_data()


class Index(Resource):
    def get(self):
        return redirect('/apidocs/#/')


class ClusterAPI(Resource):
    def get(self):
        """
        This endpoint returns clusters
        ---
        parameters:
          - name: n_clusters
            in: query
            type: integer
            required: false
            default: 3
            description: The number of clusters to return.
          - name: n_top
            in: query
            type: integer
            required: false
            default: 10
            description: The number of top articles to return for each cluster.
          - name: start
            in: query
            type: string
            required: false
            description : The start date for the articles (ISO 8601).
          - name: end
            in: query
            type: string
            required: false
            description : The end date for the articles (ISO 8601).
        responses:
          200:
             description: A list of clusters with their articles and top words.
        """
        parser = reqparse.RequestParser()
        argument1 = reqparse.Argument(
            'n_clusters', default=3, location='args', type=int, required=False)
        argument2 = reqparse.Argument(
            'n_top', default=3, location='args', type=int, required=False)
        argument3 = reqparse.Argument(
            'start', default=None, location='args', type=str, required=False)
        argument4 = reqparse.Argument(
            'end', default=None, location='args', type=str, required=False)
        parser.add_argument(argument1)
        parser.add_argument(argument2)
        parser.add_argument(argument3)
        parser.add_argument(argument4)
        args = parser.parse_args()
        data = process(articles_df, args['n_clusters'],
                       args['n_top'], args['start'], args['end'])
        return jsonify(data)


class ArticleAPI(Resource):
    def get(self):
        """
        This endpoint returns articles
        ---
        parameters:
          - name: id
            in: query
            type: integer
            required: false
            description : The id of an article.
          - name: journal
            in: query
            type: string
            required: false
            description : The pattern to match for the journals.
          - name: title
            in: query
            type: string
            required: false
            description : The pattern to match for the titles.
          - name: start
            in: query
            type: string
            required: false
            description : The start date for the articles (ISO 8601).
          - name: end
            in: query
            type: string
            required: false
            description : The end date for the articles (ISO 8601).
        responses:
          200:
             description: A list of articles.
        """
        parser = reqparse.RequestParser()
        argument1 = reqparse.Argument(
            'id', default=None, location='args', type=int, required=False)
        argument2 = reqparse.Argument(
            'journal', default=None, location='args', type=str, required=False)
        argument3 = reqparse.Argument(
            'title', default=None, location='args', type=str, required=False)
        argument4 = reqparse.Argument(
            'start', default=None, location='args', type=str, required=False)
        argument5 = reqparse.Argument(
            'end', default=None, location='args', type=str, required=False)
        parser.add_argument(argument1)
        parser.add_argument(argument2)
        parser.add_argument(argument3)
        parser.add_argument(argument4)
        parser.add_argument(argument5)
        args = parser.parse_args()
        data = get_articles(
            articles_df, args['id'], args['journal'], args['title'], args['start'], args['end'])
        return jsonify(data)

    def post(self):
        """
        Filter articles by ID.
        ---
        requestBody:
          description: List of IDs to filter by.
          required: true
          content:
            application/json:
              schema:
                type: object
                properties:
                  ids:
                    type: array
                    items:
                      type: integer
        responses:
          200:
            description: List of filtered articles.
        """
        parser = reqparse.RequestParser()
        argument1 = reqparse.Argument(
            'ids', required=True, location='json', type=list,
            help='List of IDs is required')
        parser.add_argument(argument1)
        args = parser.parse_args()
        data = get_articles(articles_df, ids=args['ids'])
        return jsonify(data)


class MailAPI(Resource):
    def get(self):
        """
        This endpoint returns clusters
        ---
        parameters:
          - name: sender
            in: query
            type: integer
            required: false
            description : The sender of a mail.
          - name: weight
            in: query
            type: int
            required: false
            description : The weight of a mail.
          - name: width
            in: query
            type: int
            required: false
            description : The width to search for.
          - name: start
            in: query
            type: string
            required: false
            description : The start date for the articles (ISO 8601).
          - name: end
            in: query
            type: string
            required: false
            description : The end date for the articles (ISO 8601).
        responses:
          200:
             description: A list of clusters with their articles and top words.
        """
        parser = reqparse.RequestParser()
        argument1 = reqparse.Argument(
            'sender', default='Sven Flecha', location='args', type=str, required=False)
        argument2 = reqparse.Argument(
            'weight', default=10, location='args', type=int, required=False)
        argument3 = reqparse.Argument(
            'width', default=4, location='args', type=int, required=False)
        argument4 = reqparse.Argument(
            'start', default=None, location='args', type=str, required=False)
        argument5 = reqparse.Argument(
            'end', default=None, location='args', type=str, required=False)
        parser.add_argument(argument1)
        parser.add_argument(argument2)
        parser.add_argument(argument3)
        parser.add_argument(argument4)
        parser.add_argument(argument5)
        args = parser.parse_args()

        data = filter_mails(
            df=mails_df, sender=[args['sender']], weight=args['weight'], width=args['width'], start=args['start'], end=args['end'])

        return jsonify(data)


class MailNamesAPI(Resource):
    def get(self):
        """
        This endpoint returns clusters
        ---
        parameters:
          - name: start
            in: query
            type: string
            required: false
            description : The start date for the articles (ISO 8601).
          - name: end
            in: query
            type: string
            required: false
            description : The end date for the articles (ISO 8601).
        responses:
          200:
             description: A list of clusters with their articles and top words.
        """
        parser = reqparse.RequestParser()
        argument1 = reqparse.Argument(
            'start', default=None, location='args', type=str, required=False)
        argument2 = reqparse.Argument(
            'end', default=None, location='args', type=str, required=False)
        parser.add_argument(argument1)
        parser.add_argument(argument2)
        args = parser.parse_args()

        data = get_mail_names(mails_df, args['start'], args['end'])

        return jsonify(data)


api.add_resource(Index, '/')
api.add_resource(ClusterAPI, '/clusters')
api.add_resource(ArticleAPI, '/articles')
api.add_resource(MailAPI, '/mails')
api.add_resource(MailNamesAPI, '/mails/names')

if __name__ == '__main__':
    app.run(debug=True)
