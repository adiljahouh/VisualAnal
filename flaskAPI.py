from flask import Flask, request, jsonify
import pandas as pd
import json
app = Flask(__name__)

# Sample data, full preprocessing of dataframe should be done once in preprocesing.py


def preprocessMailData(sampleSize=100, From=['Sven Flecha'], width=4, data=None, blacklist=[]):
    emailData = pd.read_csv('data/emailheaders.csv', encoding='cp1252')
    # remove whitespaces, there are a lot in "To"
    emailData['From'] = emailData['From'].str.strip()
    # this is REALLY inefficient but we dont know how we want to preprocess everything yet..
    personalData = pd.read_excel(
        'data/EmployeeRecords.xlsx')[['EmailAddress', 'FirstName', 'LastName']]
    personalData['FullName'] = personalData['FirstName'] + \
        ' ' + personalData['LastName']
    personalDataClean = personalData[['EmailAddress', 'FullName']]
    nameToMailMapper = pd.Series(
        personalDataClean.FullName.values, index=personalDataClean.EmailAddress).to_dict()
    mappedMails = emailData.replace(
        {'From': nameToMailMapper})
    subset = mappedMails[mappedMails['From'].isin(From)]
    if subset.empty:
        print(
            f"Stopped at width {width} because no data was found for mailers {From}")
        return [['From', 'To', 'Weight']] + data
    sample = subset.sample(sampleSize)
    # get every specific recipient as a separate row
    listifiedEmailData = sample.assign(To=sample.To.str.split(','))
    explodedEmailData = listifiedEmailData.explode('To').reset_index(drop=True)
    explodedEmailData['To'] = explodedEmailData['To'].str.strip()
    replacedTo = explodedEmailData.replace(
        {'To': nameToMailMapper})
    # remove the mails that were sent from and to the same person
    removedCycle = replacedTo[replacedTo['From']
                              != replacedTo['To']]
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
    sampleSize=10, From=['Kanon Herrero', 'Sven Flecha'], width=3)
# Route for creating a new task


@app.route('/api/Sankey', methods=['GET'])
def create_task():
    return json.dumps(sankeyData), 201


if __name__ == '__main__':
    app.run(debug=True)
