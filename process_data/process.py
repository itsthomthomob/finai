# ---------------------------------------------
#
# Process.py
# - Converts the tweets.json file into usable vector values
# - The general process is:
# - Set Up -> Import Data -> Pre Process Data -> Embed Words
#
# Code sourced from https://towardsdatascience.com/word2vec-explained-49c52b4ccb71
#
# ---------------------------------------------


import json
import pandas as pd
import nltk
import string
import matplotlib.pyplot as plt

from nltk.corpus import stopwords
from nltk import word_tokenize
from gensim.models import Word2Vec as w2v
from sklearn.decomposition import PCA

# ---------------------------------------------
#                  SET UP
# ---------------------------------------------

# constants
PATH = 'C:/Users/Thomas/Desktop/Projects/FinAI/finai/process_data/data/tweets.json'
sw = stopwords.words('english')
plt.style.use('ggplot')

# ---------------------------------------------
#               IMPORT DATA
# ---------------------------------------------

lines = []
with open(PATH, encoding='utf-8') as f:
    data = json.load(f)
    for item in data:
        lines.append(item['text'])


# ---------------------------------------------
#            PRE-PROCESS DATA
# ---------------------------------------------

# remove new lines
lines = [line.rstrip('\n') for line in lines]

# make all characters lower
lines = [line.lower() for line in lines]

# remove punctuations from each line
lines = [line.translate(str.maketrans('', '', string.punctuation))
         for line in lines]

# tokenize
lines = [word_tokenize(line) for line in lines]


def remove_stopwords(lines, sw=sw):
    '''
    The purpose of this function is to remove stopwords from a given array of 
    lines.

    params:
        lines (Array / List) : The list of lines you want to remove the stopwords from
        sw (Set) : The set of stopwords you want to remove

    example:
        lines = remove_stopwords(lines = lines, sw = sw)
    '''

    res = []
    for line in lines:
        original = line
        line = [w for w in line if w not in sw]
        if len(line) < 1:
            line = original
        res.append(line)
    return res


filtered_lines = remove_stopwords(lines=lines, sw=sw)

# ---------------------------------------------
#                EMBED WORDS
# ---------------------------------------------

w = w2v(
    filtered_lines,
    min_count=3,  
    sg = 1,       
    window=7      
)       

print(w.wv.most_similar('buy'))

emb_df = (
    pd.DataFrame(
        [w.wv.get_vector(str(n)) for n in w.wv.key_to_index],
        index = w.wv.key_to_index
    )
)
print(emb_df.shape)
emb_df.head()

# ---------------------------------------------
#                GENERATE PCA
# ---------------------------------------------

pca = PCA(n_components=2, random_state=7)
pca_mdl = pca.fit_transform(emb_df)

emb_df_PCA = (
    pd.DataFrame(
        pca_mdl,
        columns=['x','y'],
        index = emb_df.index
    )
)

plt.clf()
fig = plt.figure(figsize=(6,4))

plt.scatter(
    x = emb_df_PCA['x'],
    y = emb_df_PCA['y'],
    s = 0.4,
    color = 'maroon',
    alpha = 0.5
)

plt.xlabel('PCA-1')
plt.ylabel('PCA-2')
plt.title('PCA Visualization')
plt.plot()

# save the plot to a file
plt.savefig('pca_plot.png')

# show the plot
plt.show()