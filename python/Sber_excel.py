import pandas as pd

# file_name = "./Выписки по р. с. и иные документы/Exel/СберБизнес 1,2 кв 2021.xlsx"
file_name = "../../Выписки по р. с. и иные документы/Сбер/СберБизнес2,3 кв 2021.xlsx"


xlsx = pd.ExcelFile(file_name)
lst_names = xlsx.sheet_names

# Поиск заголовка
df = pd.read_excel(xlsx, sheet_name=lst_names[0])
df.dropna(axis='columns', how='all', inplace=True)

# Поиск строки с заголовком
index = -1
for string in df.values:
    index += 1
    count = 0
    for words in string:
        if type(words) == str:
            for word in words.lower().split():
                if word == 'дата' or word == 'назначение':
                    count += 1
    if count == 2:
        df.columns = df.iloc[0]
        break
    df.drop(labels=index, inplace=True)


df_with_header = df
worksheets_dfs = []


# Очистка всего, кроме колонок
for worksheet in lst_names[1:]:
    df = pd.read_excel(xlsx, sheet_name=worksheet, header=None)
    if df.shape[1] > 8:
        for i in range(df.shape[1]-9):
            df.drop(df.columns[len(df.columns)-1], axis=1, inplace=True)
    worksheets_dfs.append(df)

# Соединение в 1 ДФ
if len(lst_names) > 1:
    full_df = pd.concat(worksheets_dfs)
    full_df.columns = df_with_header.columns
    df = pd.concat([df_with_header, full_df])

df.dropna(axis=0, how='all', inplace=True)
df.reset_index(drop=True, inplace=True)


index = -1
for i in df[df.columns[0]].values:
    index += 1
    if type(i) == float:
        df.drop(labels=index, inplace=True)
    elif type(i) == str:
        if i.count('.') != 2:
            df.drop(labels=index, inplace=True)
    else:
        continue

df.dropna(axis='columns', how='all', inplace=True)


df.drop(columns=[df.columns[-2], df.columns[-3], df.columns[-4]], inplace=True)
df.reset_index(drop=True, inplace=True)

for i in [3, 4]:
    df[df.columns[i]].fillna(0, inplace=True)


df.fillna('', inplace=True)
df = df.astype(str)


df.columns = ["Дата", "Cчет дебет", "Cчет кредит", 'Дебет', 'Кредит', "Назначение платежа"]
inn_dict = dict()
df.insert(1, 'ИНН дебет', '')
df.insert(3, 'ИНН кредит', '')
clear_cols = [2, 4]

for col in clear_cols:
    index = -1
    for i in df[df.columns[col]].values:
        index += 1
        if type(i) == str:
            for elem in i.split():
                if elem.isdigit():
                    df[df.columns[col]][index] = df[df.columns[col]][index].replace(elem, '')
                    if 10 <= len(elem) <= 12:
                        df[df.columns[col - 1]][index] = elem
                        break
        if df[df.columns[col - 1]][index].strip() not in inn_dict:
            if df[df.columns[col - 1]][index].strip() != '':
                inn_dict[df[df.columns[col]][index].strip().lower()] = df[df.columns[col - 1]][index].strip()

    df[df.columns[col]] = df[df.columns[col]].str.replace('nan', '').str.strip()


# for i in df.columns:
#     df[i] = df[i].str.replace('\n', ' ')
# Проверка колонок с ИНН
check_columns_empty_val = [1, 3]
for col in check_columns_empty_val:
    index = -1
    for i in df[df.columns[col]].values:
        index += 1
        if i == '':
            # Замена значением из словаря
            if df[df.columns[col+1]][index].lower() in inn_dict:
                df[df.columns[col]][index] = inn_dict[df[df.columns[col+1]][index].lower()]

# Округление значений в Дебет, Кредит
df[[df.columns[-2], df.columns[-3]]] = df[[df.columns[-2], df.columns[-3]]].round(2)
print(df[df.columns[-3]].astype(float).sum().round(2))
print(df[df.columns[-2]].astype(float).sum().round(2))
print(1)
