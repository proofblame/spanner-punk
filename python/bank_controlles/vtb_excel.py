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
cont.reset_ind(df)

# Поиск строки с заголовком
cont.find_header(df)
# Удаление столбцов

df = df.drop(columns=[df.columns[1], df.columns[2], df.columns[5]])

cont.reset_ind(df)

cont.check_date(df)
cont.reset_ind(df)

cont.fill_deb(df, -2, -3)

df = df.rename(columns={'Дата' : 'data', 'БИК банка корр.' : 'bik',
                        'Название корр.' : 'bank_name', 'Дебет' : 'deb', 'Кредит' : 'cred', 'Назначение' : 'purpose'})
output_file_path = output_directory + file_name + '.json'
df.to_json(output_file_path, orient='records', force_ascii=False)

print(r'{"status": "success"}')
