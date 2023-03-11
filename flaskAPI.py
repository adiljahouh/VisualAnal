from flask import Flask, request, jsonify
import pandas as pd
import json
app = Flask(__name__)

# Sample data, full preprocessing of dataframe should be done once in preprocesing.py


def preprocessMailData(sampleSize=100, From=['Sven.Flecha@gastech.com.kronos'], width=4, data=None, blacklist=[]):
    emailData = pd.read_csv('data/emailheaders.csv', encoding='cp1252')
    # only get the mails from the selected senders
    subset = emailData[emailData['From'].isin(From)]
    if subset.empty:
        print(
            f"Stopped at width {width} because no data was found for mailers {From}")
        return [['From', 'To', 'Weight']] + data
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
    # sankeyFormatDf = sankeyFormatDf[sankeyFormatDf['Weight'] > 5]
    newBlackList = sankeyFormatDf['From'].unique().tolist() + blacklist
    sankeyFormatDf = sankeyFormatDf[~sankeyFormatDf['To'].isin(
        newBlackList)]  # A sender cannot be a recipient EVER
    valuesList = sankeyFormatDf.values.tolist()
    if data is not None:
        valuesList = data + valuesList
    if width > 0:
        valuesList = preprocessMailData(
            sampleSize, sankeyFormatDf['To'].unique(), width-1, valuesList, blacklist=newBlackList)
        return valuesList
    else:
        columnsList = sankeyFormatDf.columns.values.tolist()
        # remove all those who were froms as "to's" from the eventual df
        valuesList = [columnsList] + valuesList
        return valuesList
    # TODO: sort in weight or something


sankeyData = preprocessMailData(
    sampleSize=3, From=['Kanon.Herrero@gastech.com.kronos', 'Sven.Flecha@gastech.com.kronos'], width=5)
# Route for creating a new task


@app.route('/api/Sankey', methods=['GET'])
def create_task():
    return json.dumps(sankeyData), 201


if __name__ == '__main__':
    app.run(debug=True)
