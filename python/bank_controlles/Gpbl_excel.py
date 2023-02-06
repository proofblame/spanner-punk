import os.path
import sys
import pandas as pd
import warnings
import controllers as control

warnings.filterwarnings('ignore', category=UserWarning, module='openpyxl')

# file_name = "./uploads/sber.xlsx"
directory = sys.argv[1]
file_name = sys.argv[2]
file_extension = sys.argv[3]
output_directory = sys.argv[4]

path_to_file = directory + file_name +'.'+ file_extension

df = pd.read_excel(path_to_file, sheet_name=0)

names = ['Дата операции',
        'БИК банка контрагента',
        'Наименование банка контрагента',
        'ИНН плательщика/получателя',
        'Наименование плательщика/получателя',
        'Дебет',
        'Кредит',
        'Назначение платежа',
        ]


df = df[names]
check_columns = [3]
control.check_inn(df, check_columns)
df[[df.columns[-2], df.columns[-3]]] = df[[df.columns[-2], df.columns[-3]]].round(2)
output_file_path = output_directory + file_name + '.json'
df.to_json(output_file_path, orient='records', force_ascii=False)

print(r'{"status": "success"}')
