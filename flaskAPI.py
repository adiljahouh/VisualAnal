from flask import Flask, request, jsonify
import pandas as pd
import json
app = Flask(__name__)

# Sample data, full preprocessing of dataframe should be done once in preprocesing.py


def preprocessMailData(sampleSize=100, From=['Sven.Flecha@gastech.com.kronos']):
    emailData = pd.read_csv('data/emailheaders.csv', encoding='cp1252')
    # only get the mails from the selected senders
    subset = emailData[emailData['From'].isin(From)]
    sample = subset.sample(sampleSize)
    # get every specific recipient as a separate row
    listifiedEmailData = sample.assign(To=emailData.To.str.split(','))
    explodedEmailData = listifiedEmailData.explode('To').reset_index(drop=True)
    # remove the mails that were sent to the same person
    removedCycle = explodedEmailData[explodedEmailData['From']
                                     != explodedEmailData['To']]
    sankeyFormatDf = removedCycle.groupby(
        ['From', 'To'], as_index=False)['Subject'].count()
    sankeyFormatDf.rename(columns={'Subject': 'Weight'}, inplace=True)
    columnsList = sankeyFormatDf.columns.values.tolist()
    valuesList = sankeyFormatDf.values.tolist()
    valuesList.insert(0, columnsList)
    return valuesList
    # TODO: sort in weight or something
    # TODO: add recursive function to use recipient as senders for next iteration


sankeyData = preprocessMailData(
    15, ['Kanon.Herrero@gastech.com.kronos', 'Sven.Flecha@gastech.com.kronos'])
# Route for creating a new task


@app.route('/api/Sankey', methods=['GET'])
def create_task():
    return json.dumps(sankeyData), 201


if __name__ == '__main__':
    app.run(debug=True)
