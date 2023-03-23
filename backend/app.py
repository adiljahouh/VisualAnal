from processing import initialize_data, process, get_articles
from flask import Flask, jsonify, redirect
from flask_restful import Api, Resource, reqparse
from flasgger import Swagger
from flask_cors import CORS


app = Flask(__name__)
api = Api(app)  # Flask restful wraps Flask app around it.
swagger = Swagger(app)
cors = CORS(app)

# Load the pre-processed data from the CSV file
df = initialize_data()


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
        data = process(df, args['n_clusters'],
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
          - name: n_sentences
            in: query
            type: string
            required: false
            description : The number of most important sentences per article used for the summary.
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
        argument6 = reqparse.Argument(
            'n_sentences', default=3, location='args', type=int, required=False)
        parser.add_argument(argument1)
        parser.add_argument(argument2)
        parser.add_argument(argument3)
        parser.add_argument(argument4)
        parser.add_argument(argument5)
        parser.add_argument(argument6)
        args = parser.parse_args()
        data = get_articles(
            df, args['id'], args['journal'], args['title'], args['start'], args['end'], args['n_sentences'])
        return jsonify(data)


api.add_resource(Index, '/')
api.add_resource(ClusterAPI, '/clusters')
api.add_resource(ArticleAPI, '/articles')

if __name__ == '__main__':
    app.run(debug=True)
