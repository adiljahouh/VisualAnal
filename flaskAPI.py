from flask import Flask
import pandas as pd
import json
import os.path
from Preprocessing import preprocessMails
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Sample data, full preprocessing of dataframe should be done once in preprocesing.py


def filterMails(weight=10, From=['Sven Flecha'], width=4, data=None, blacklist=[], dateStart='2014-01-06', dateEnd='2014-01-17'):
    """
        returns a list of lists, where the mails sent from the people in the From list are filtered by weight and are all between
        startDate and endDate. Note that the only goal of this visualization is to show frequency of mails sent between people within a timezone
    """
    emailData = pd.read_csv('data/MailsClean.csv')
    emailData['Date'] = pd.to_datetime(
        emailData['Date'], format='%Y/%m/%d %H:%M:%S')
    subset = emailData[emailData['From'].isin(From)]
    subset = subset[subset['Date'] >= dateStart]
    subset = subset[subset['Date'] <= dateEnd]
    removedCycle = subset[subset['From']
                          != subset['To']]
    sankeyFormatDf = removedCycle.groupby(
        ['From', 'To'], as_index=False)['Subject'].count()
    sankeyFormatDf = sankeyFormatDf[sankeyFormatDf['Subject'] > weight]
    sankeyFormatDf.rename(columns={'Subject': 'Weight'}, inplace=True)
    # sankeyFormatDf = sankeyFormatDf[sankeyFormatDf['Weight'] > 5]
    newBlackList = sankeyFormatDf['From'].unique().tolist() + blacklist
    sankeyFormatDf = sankeyFormatDf[~sankeyFormatDf['To'].isin(
        newBlackList)]  # A sender cannot be a recipient EVER
    valuesList = sankeyFormatDf.values.tolist()
    if data is not None:
        valuesList = data + valuesList
    if width > 0:
        valuesList = filterMails(
            weight, sankeyFormatDf['To'].unique(), width-1, valuesList, blacklist=newBlackList)
        return valuesList
    else:
        columnsList = sankeyFormatDf.columns.values.tolist()
        # remove all those who were froms as "to's" from the eventual df
        valuesList = [columnsList] + valuesList
        return valuesList
    # TODO: sort in weight or something


@app.route('/api/Sankey/<sender>/<int:weight>/<int:width>/<dateStart>/<dateEnd>', methods=['GET'])
def getSankeyData(sender, weight, width, dateStart, dateEnd):
    print(sender, weight, width, dateStart, dateEnd)
    sender = sender.replace('-', ' ')
    sankeyData = filterMails(
        weight=weight, From=[sender], width=width, dateStart=dateStart, dateEnd=dateEnd)
    return json.dumps(sankeyData), 201


@app.route('/api/Sankey/names', methods=['GET'])
def getNames():
    emailData = pd.read_csv('data/MailsClean.csv')
    names = emailData['From'].unique().tolist()
    return json.dumps(names), 201


if __name__ == '__main__':
    preprocessMails()  # creates mailsClean.csv in /data/ directory if not exists
    app.run(debug=True)
