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
        elif type(i) == str:
            if i.count('.') != 2:
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
