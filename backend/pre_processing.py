import os
import pandas as pd


def preprocess_mails(path_input_mails='data/emailheaders.csv',
                     path_input_personal='data/EmployeeRecords.xlsx',
                     path_output='data/MailsClean.csv'):
    """
    Preprocesses the mails and saves them to a csv file to later "query" on.
            ---
        parameters:
            - path_input_mails: The path to the csv file containing the mails.
            - path_input_personal: The path to the excel file containing the personal data.
            - path_output: The path to the csv file to save the preprocessed mails to.
        returns:
            - None

    """
    if not os.path.isfile(path_output):
        email_data = pd.read_csv(path_input_mails, encoding='cp1252')
        email_data['From'] = email_data['From'].str.strip()
        personal_data = pd.read_excel(path_input_personal)[
            ['EmailAddress', 'FirstName', 'LastName']]
        personal_data['FullName'] = personal_data['FirstName'] + \
            ' ' + personal_data['LastName']
        personal_data_clean = personal_data[['EmailAddress', 'FullName']]
        name_to_mail_mapper = pd.Series(
            personal_data_clean.FullName.values,
            index=personal_data_clean.EmailAddress).to_dict()
        name_to_mail_mapper.pop('Sten.Sanjorge Jr.@gastech.com.kronos')
        name_to_mail_mapper[
            'Sten.Sanjorge Jr.@gastech.com.tethys'] = 'Sten Sanjorge Jr. Tethys'
        name_to_mail_mapper[
            'Sten.Sanjorge Jr.@gastech.com.kronos'] = 'Sten Sanjorge Jr. Kronos'
        mapped_mails = email_data.replace({'From': name_to_mail_mapper})
        listified_email_data = mapped_mails.assign(
            To=mapped_mails.To.str.split(','))
        exploded_email_data = listified_email_data.explode(
            'To').reset_index(drop=True)
        exploded_email_data['To'] = exploded_email_data['To'].str.strip()
        replaced_to = exploded_email_data.replace({'To': name_to_mail_mapper})
        replaced_to['Date'] = pd.to_datetime(
            replaced_to['Date'], format='%m/%d/%Y %H:%M')
        replaced_to.to_csv(path_output, index=False)


if __name__ == '__main__':
    print('preprocessing.py')
    preprocess_mails('data/emailheaders.csv',
                     'data/EmployeeRecords.xlsx', 'results/mails_clean.csv')
