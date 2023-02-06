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
