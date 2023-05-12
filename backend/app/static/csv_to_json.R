library(tidyverse)
library(jsonlite)

data = read_csv("stimulus_material_study3.csv")

json = toJSON(data)

write(json, 'stimulus_material.json')
