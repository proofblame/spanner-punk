import os.path
import sys
import pandas as pd
import warnings
import controllers as cont

warnings.filterwarnings('ignore', category=UserWarning, module='openpyxl')


path_to_file = sys.argv[1]
file_name = sys.argv[2]
output_directory = sys.argv[3]

xlsx = pd.ExcelFile(path_to_file)
lst_names = xlsx.sheet_names

# Поиск заголовка
df = pd.read_excel(xlsx, sheet_name=lst_names[0])
df.dropna(axis='columns', how='all', inplace=True)

# Поиск строки с заголовком
cont.find_header(df)
df.dropna(axis='columns', how='all', inplace=True)
df.reset_index(drop=True, inplace=True)

# cont.concat_excel(df, xlsx)

df[df.columns[0]] = df[df.columns[0]].astype(str)
cont.check_date(df)
cont.reset_ind(df)
df.drop(columns=[df.columns[-2], df.columns[-3], df.columns[-4]], inplace=True)
cont.reset_ind(df)

cont.fill_deb(df, -2, -3)
df = df.astype(str)

for i in df.columns:
    df[i] = df[i].str.replace('\n', ' ')
for i in df.columns[3:5]:
    df[i] = df[i].str.replace(' ', '').str.replace(',', '.')


df.columns = ["Дата", "Cчет дебет", "Cчет кредит", 'Дебет', 'Кредит', "Назначение платежа"]

df.insert(1, 'ИНН дебет', '')
df.insert(3, 'ИНН кредит', '')

clear_cols = [2, 4]

cont.check_empty_inn_columns(df, clear_cols)

# Округление значений в Дебет, Кредит
df[[df.columns[-2], df.columns[-3]]] = df[[df.columns[-2], df.columns[-3]]].round(2)

df = df.rename(columns ={"Дата": 'data',  "ИНН дебет": 'bik',  "Cчет дебет": 'bank_name', "ИНН кредит": 'inn',
                         "Cчет кредит":'ka', "Дебет": 'deb', "Кредит": 'cred', "Назначение платежа": 'purpose'})
output_file_path = output_directory + file_name + '.json'
df.to_json(output_file_path, orient='records', force_ascii=False)

print(r'{"status": "success"}')
