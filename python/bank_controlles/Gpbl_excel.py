import os.path
import sys
import pandas as pd
import warnings
import controllers as cont

warnings.filterwarnings('ignore', category=UserWarning, module='openpyxl')

# file_name = "./uploads/sber.xlsx"
directory = sys.argv[1]
file_name = sys.argv[2]
file_extension = sys.argv[3]
output_directory = sys.argv[4]

path_to_file = directory + file_name + "." + file_extension

xlsx = pd.ExcelFile(path_to_file)
lst_names = xlsx.sheet_names

# Поиск заголовка
df = pd.read_excel(xlsx, sheet_name=lst_names[0])
df.dropna(axis='columns', how='all', inplace=True)

df = df.drop(columns=[df.columns[1], df.columns[2]])
df = df[['Дата операции', 'БИК банка контрагента', 'Наименование банка контрагента',
         'ИНН плательщика/получателя', 'Наименование плательщика/получателя',
         'Дебет', 'Кредит', 'Назначение платежа']]

df = df.rename(columns ={ 'Дата операции': 'data', 'БИК банка контрагента': 'bik', 'Наименование банка контрагента' : 'bank_name', 
        'ИНН плательщика/получателя':'inn', 'Наименование плательщика/получателя': 'ka', 'Дебет' : 'deb', 'Кредит' : 'cred', 'Назначение платежа': 'Purpose'})
output_file_path = output_directory + file_name + '.json'
df.to_json(output_file_path, orient='records', force_ascii=False)

print(r'{"status": "success"}')
