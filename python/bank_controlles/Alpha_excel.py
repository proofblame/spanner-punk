import os.path
import sys
import pandas as pd
import warnings
import controllers as cont

warnings.filterwarnings('ignore', category=UserWarning, module='openpyxl')

directory = sys.argv[1]
file_name = sys.argv[2]
file_extension = sys.argv[3]
output_directory = sys.argv[4]

path_to_file = directory + file_name + '.' + file_extension
# path_to_file = r"../Выписки по р. с. и иные документы/Альфабанк/Выписка_40702810129050006373_21.11.2021-21.11.2022.xlsx"

xlsx = pd.ExcelFile(path_to_file)
lst_names = xlsx.sheet_names

# Поиск заголовка
df = pd.read_excel(xlsx, sheet_name=lst_names[0])
df.dropna(axis='columns', how='all', inplace=True)

# Поиск строки с заголовком
cont.find_header(df)

df = df.drop(columns=df.iloc[:, -2:])
df.columns = ['Дата', 'Номер документа',
              'Дебет', 'Кредит', 'Контрагент', 'ИНН', 'КПП',
              'Счет', 'БИК', 'Наименование банка', 'Назначение платежа']

df = df.drop(columns=[df.columns[1], df.columns[6], df.columns[7]])

df.dropna(axis=0, how='all', inplace=True)
df.reset_index(drop=True, inplace=True)

cont.check_date(df)

df.dropna(axis=0, how='all', inplace=True)
df.reset_index(drop=True, inplace=True)

cont.fill_deb(df, 1, 2)

df = df.rename(columns ={'Дата' : 'data', 'БИК' : 'bik', 'Наименование банка' : 'bank_name', 
                         'ИНН' : 'inn', 'Контрагент' : 'ka', 'Дебет' : 'deb', 'Кредит' : 'cred', 'Назначение платежа' : 'purpose'})

output_file_path = output_directory + file_name + '.json'
df.to_json(output_file_path, orient='records', force_ascii=False)

print(r'{"status": "success"}')
