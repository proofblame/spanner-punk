import numpy as np


# Процедура для очистки пустых строк и обновления индекса
def reset_ind(df):
    df.dropna(axis='index', how='all', inplace=True)
    df.reset_index(drop=True, inplace=True)


def res(df):
    df.reset_index(drop=True, inplace=True)
    index = -1

# Процедура для формирования списка с индексами главных элементов
def get_index_lst(df):
    # Важные колонки с Кор. счетом, ИНН и наименованием
    column1, column2 = df.columns[1], df.columns[2]
    # Списки с индексами элементов
    ind_1 = find_indexes(df, column1)
    ind_2 = find_indexes(df, column2)
    res = []
    # Добавление первого найденного индекса
    # for i in range(min(len(ind_2), len(ind_1))):
    lst_len = min(len(ind_1), len(ind_2))
    for i in range(lst_len):
        res.append(min(ind_1[i], ind_2[i]))
    return res


def insert_zero(df, col_without_zero, col_zero_insert):
    ind = -1
    no_zero = df.columns[col_without_zero]
    zero = df.columns[col_zero_insert]
    for i in df[no_zero].values:
        ind += 1
        if type(i) == str:
            if i != '0':
                df.loc[ind, no_zero] = df.loc[ind, no_zero].replace(' ', '').replace(',', '.')  # .astype('float')
                df.loc[ind, zero] = '0'

            if i != '0':
                if i.isdigit():
                    df.loc[ind, zero] = np.nan
                else:
                    df.loc[ind, no_zero] = df.loc[ind, no_zero].replace(' ', '').replace(',', '.')  # .astype('float')
                    df.loc[ind, zero] = '0'


# Нули в колонку и в следующую
def insert_zeros(df, num_column):
    index = -1
    for i in df[df.columns[num_column]]:
        index += 1
        if type(df[df.columns[num_column]][index]) == str:
            df[df.columns[num_column+1]][index] = '0,00'

    index = -1
    for i in df[df.columns[num_column+1]]:
        index += 1
        if type(df[df.columns[num_column+1]][index]) == str:
            if df[df.columns[num_column+1]][index] != '0,00':
                df[df.columns[num_column]][index] = '0,00'
    return df

# Процедура для нахождения индексов ИНН
def find_indexes(df, column):
    ind_cor = []
    ind_inn = []
    ind = -1
    for elem in df[column].values:
        ind += 1
        # Удаление кор счета
        if type(elem) == str:
            if elem.isdigit():
                if len(elem) == 10 or len(elem) == 12:
                    ind_inn.append(ind)
                elif len(elem) == 20:
                    ind_cor.append(ind)
                    df[column][ind] = np.nan
    # отрезать последний элемент

    # Сравнение длины списка по ИНН и кор.счету
    i = -1
    if len(ind_cor) < len(ind_inn):
        while len(ind_cor) < len(ind_inn):
            i += 1
            if i > len(ind_cor) - 1:
                ind_cor.append(ind_inn[i])
            try:
                if ind_cor[i] > ind_inn[i]:
                    ind_cor.insert(i, ind_inn[i])
            finally:
                continue
        return ind_cor
    else:
        return ind_cor


def concat_inn(columns, df):
    ind_company = 0
    for col in columns:
        current_number_index = -1
        for i in df[col].values:
            current_number_index += 1
            if type(i) == str and i.isdigit():
                ind_company = current_number_index
                if len(i) == 20:
                    ind = df.index[df[col] == i].tolist()
                    df.loc[ind, col] = np.nan

            elif type(i) == str and not i.isdigit():
                try:
                    df.loc[ind_company, col] += ' ' + df.loc[current_number_index, col]
                    df.loc[current_number_index, col] = np.nan
                finally:
                    continue
    reset_ind(df)


# Выравнивание уровней документа
def equality_of_levels(df):
    cur_ind = -1
    for i in df.values:
        cur_ind += 1
        if cur_ind > 0:
            for col in df.columns[:-1]:
                if type(df.loc[cur_ind, col]) == str:
                    try:
                        df.loc[cur_ind - 1, col] = df.loc[cur_ind, col]
                        df.loc[cur_ind, col] = np.nan
                    finally:
                        continue
    reset_ind(df)


# def concat_string(df):
#     columns = df.columns
#     ind = -1
#     for i in df.values:
#         ind += 1
#         row = -1
#
#         count_str = 0
#         for j in i.tolist()[:-1]:
#             row += 1
#             if type(j) == str:
#                 count_str += 1
#         if count_str == 5:
#             continue
#
#         elif count_str > 0:
#             full_obj_ind = ind
#
#             for j in df.loc[full_obj_ind]:
#                 if type(j) == str:
#                     count_str += 1
#
#             if count_str == 6:
#                 continue
#             else:
#                 for col in columns:
#                     full_str = 1
#                     try:
#                         while type(df[col][full_obj_ind]) != str:
#                             if type(df[col][full_obj_ind + full_str]) == str:
#                                 df[col][full_obj_ind] = df[col][full_obj_ind + full_str]
#                                 df[col][full_obj_ind + full_str] = np.nan
#                             else:
#                                 full_str += 1
#                                 continue
#                     finally:
#                         continue
#     reset_ind(df)


# Процедура для слияния строк
def concat_string(df):
    columns = df.columns
    ind = -1
    for i in df.values:
        ind += 1
        row = -1
        count_str = 0
        for j in i.tolist()[:-1]:
            row += 1
            if type(j) == str:
                count_str += 1
        if count_str == 5:
            continue

        elif count_str > 0:
            if type(i) == str and i.isdigit():
                if len(i) == 20:

                    full_obj_ind = ind

                    for j in df.loc[full_obj_ind]:
                        if type(j) == str:
                            count_str += 1
                    if count_str == 6:
                        continue
                    else:
                        for col in columns:
                            full_str = 1
                            try:
                                while type(df[col][full_obj_ind]) != str:
                                    if type(df[col][full_obj_ind + full_str]) == str:
                                        df[col][full_obj_ind] = df[col][full_obj_ind + full_str]
                                        df[col][full_obj_ind + full_str] = np.nan
                                    else:
                                        full_str += 1
                                        continue
                            finally:
                                continue
    reset_ind(df)


# Процедура для очистки пустых значений в
def clear_nan(df):
    columns = df.columns
    ind = -1
    for i in df.values:
        ind += 1
        count_float = 0
        row = -1
        count_empty_str = 0
        for j in i.tolist()[:5]:
            row += 1
            if type(j) == float:
                count_float += 1
        if count_float == 5:
            count_empty_str += 1
            try:
                df[columns[-1]][ind - count_empty_str] += ' ' + df[columns[-1]][ind]
                df[columns[-1]][ind] = np.nan
                df.dropna(axis='index', how='all', inplace=True)
            finally:
                continue
    reset_ind(df)
