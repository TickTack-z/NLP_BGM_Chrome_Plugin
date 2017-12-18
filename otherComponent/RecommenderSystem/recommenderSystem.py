import pandas

import json

df = pandas.read_csv(r"C:\Users\sxzho\Desktop\UserPic.csv")

def convert(obj):
    if isinstance(obj, int):
        return obj
    if pandas.isnull(obj):
        return obj
    obj = json.loads(obj)
    res = 1-float(obj["next"])/obj["count"] + obj["like"]
    return res
df = df.applymap(convert)

mean_value=0
count=0
for index, row in df.iterrows():
    for j in row:
        if pandas.isnull(j):
            pass
        else:
            if j<10:
                mean_value+=j
                count+=1
mean_value=mean_value/count




print(df)
df.mean(axis=1,skipna=True)

df.mean(axis=0,skipna=True)

mean_row =list()


a = (df).mean(axis=0 , skipna=True)
a=a[1:]

b = (df.loc[:, df.columns != 'UserID (S)']).mean(axis=1 , skipna=True)
print(b)


for i in a:
    print(i)
    break

import numpy as np
matrix = [[i+j-mean_value for j in a] for i in b]
matrix_true_value = [list(df[i]) for i in list(df)[1:]]
matrix_true_value=[[matrix_true_value[j][i] for j in range(len(matrix_true_value))] for i in range(len(matrix_true_value[0]))]
matrix_true_value[0][1]
pandas.isnull(matrix_true_value[0][0])
df[(list(df)[1:])[0]]


matrix[0]



#set json res
res=[]
new_list=[i[:-4] for i in list(df)]
row_num=0
for j in df["UserID (S)"]:
    temp=dict()
    for k in range(len(new_list)):        
        if (k == 0):
            temp["UserID"] = int(j)
        else:
            temp[new_list[k]]=float(matrix[row_num][k-1])
    res.append(temp)
    row_num+=1
res
#end of setting json res




from numpy import dot
from numpy.linalg import norm
def cos(k, L):
    if len(k) != len(L):
        return 0
    return dot(k,L)/(norm(k)*norm(L))


similarity_matrix = [[0 for j in b] for i in b]
for i in range(len(similarity_matrix)):
    for j in range(len(similarity_matrix)):
        similarity_matrix[i][j] = cos(matrix[i],matrix[j])
similarity_matrix





def MSE(matrix1, matrix_true):
    count=0
    diff=0
    for i in range(len(matrix_true)):
        for j in range(len(matrix_true[i])):
            if pandas.isnull(matrix_true[i][j]):
                pass
            else:
                count+=1
                diff+=(matrix_true[i][j]-matrix1[i][j])**2
    return diff/count
            

print("MSE for baseline model:")
MSE(matrix,matrix_true_value)






#find most similiar user based on similarity
cf_matrix=[[0 for i in matrix[0]] for j in matrix]
for i in range(len(matrix)):
    for j in range(len(matrix[0])):
        temp_index_list = [similarity_matrix.index(x) for x in sorted(similarity_matrix, reverse=True)[:3]]
        #temp_max=max(similarity_matrix[i])
        #temp_index_list = [k for k,z in enumerate(similarity_matrix[i]) if z == temp_max]
        cf_matrix[i][j] = matrix[i][j]*0.9 +  matrix[temp_index_list[0]][j]*0.1
cf_matrix
print("MSE for new model:")
MSE(cf_matrix,matrix_true_value)



#set json res
res=[]
new_list=[i[:-4] for i in list(df)]
row_num=0
for j in df["UserID (S)"]:
    temp=dict()
    for k in range(len(new_list)):        
        if (k == 0):
            temp["UserID"] = int(j)
        else:
            temp[new_list[k]]=float(cf_matrix[row_num][k-1])
    res.append(temp)
    row_num+=1
res
#end of setting json res

with open('data.txt', 'w') as outfile:
    json.dump(res, outfile)



