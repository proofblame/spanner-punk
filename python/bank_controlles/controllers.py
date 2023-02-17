import datetime
import pandas as pd

# Проверяем ИНН
def check_inn(df, clear_cols):
    df.reset_index(drop=True, inplace=True)
    inn_dict = dict()
    for col in clear_cols:
        index = -1
        for i in df[df.columns[col]].values:
            index += 1
            if 10 <= len(i) <= 12:
                df[df.columns[col]][index] = i
                break
            if df[df.columns[col]][index] not in inn_dict:
                inn_dict[df[df.columns[col+1]][index].strip().lower()] = df[df.columns[col+1]][index].strip()

    df[df.columns[col]] = df[df.columns[col]].str.replace('nan', '').str.strip()
    return df

# Обнаружение заголовка
def find_header(df):
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
    return df

# Проверка даты
def check_date(df):
    index = -1
    for i in df[df.columns[0]].values:
        index += 1
        if type(i) == float:
            df.drop(labels=index, inplace=True)
        elif type(i) == str or type(i) == datetime.datetime:
            if str(i).replace('-', '.').count('.') != 2:
                df.drop(labels=index, inplace=True)
        else:
            continue
    return df        

# Дебет и кредит в число
def fill_deb(df, deb, cred):
    for i in [deb, cred]:
        df[df.columns[i]].fillna(0, inplace=True)
    df[[df.columns[deb], df.columns[cred]]] = df[[df.columns[deb], df.columns[cred]]].round(2)
    return df

# Reset index ver + hor
def reset_ind(df):
    df.dropna(axis=1, how='all', inplace=True)
    df.dropna(axis=0, how='all', inplace=True)
    df.reset_index(drop=True, inplace=True)
    return df

# create dictionary of inn
def check_empty_inn_columns(df, columns):
    inn_dict = dict()
    for col in columns:
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

    for col in columns:
        col -=  1 
        index = -1
        for i in df[df.columns[col]].values:
            index += 1
            if i == '':
                # Замена значением из словаря
                if df[df.columns[col+1]][index].lower() in inn_dict:
                    df[df.columns[col]][index] = inn_dict[df[df.columns[col+1]][index].lower()]
    return df

# Excel на нескольких листах
def concat_excel(df, xlsx):
    df_with_header = df
    worksheets_dfs = []
    lst_names = xlsx.sheet_names
    # Todo function Очистка всего, кроме колонок
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
    return df