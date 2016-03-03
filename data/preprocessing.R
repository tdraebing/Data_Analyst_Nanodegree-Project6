data <- read.csv('nuclear_weapon_tests.csv')

#create full time feature
data$datetime <- paste(data$date, data$time)
data$date <- NULL
data$time <- NULL

#combine yield and ymax
data$max_yield <- numeric(nrow(data))
data$ymax[is.na(data$ymax)] <- 0
data$yield[is.na(data$yield)] <- 0
for (i in 1:nrow(data)){
  print(i)
  if (data$ymax[i] > data$yield[i]){
    data$max_yield[i] <- data$ymax[i]
  } else {
    data$max_yield[i] <- data$yield[i]
  }
}
data$yield <- NULL
data$ymax <- NULL

#split type
data$medium <- numeric(nrow(data))
data$confirmation <- numeric(nrow(data))
data$salvo <- numeric(nrow(data))
for (i in 1:nrow(data)){
  if (grepl('A', data$type[i])){
    data$medium[i] <- 'Air'
  }else if(grepl('W', data$type[i])){
    data$medium[i] <- 'Water'
  }else if(grepl('U', data$type[i])){
    data$medium[i] <- 'Underground'
  }
  if(grepl('_SALVO', data$type[i])){
    data$salvo[i] <- 1
  }
  if (grepl('C', data$type[i])|grepl('P', data$type[i])){
    s <- strsplit(as.character(data$type[i]), split = c())[[1]]
    if(length(grep('C', s))>0 && grep('C', s) == 3){
      data$confirmation[i] <- 'confirmed'
    }else if(length(grep('P', s))>0 && grep('P', s) == 3){
      data$confirmation[i] <- 'presumed'
    }
  }else{
    data$confirmation[i] <- 'unknown'
  }
}
data$type <- NULL

write.csv(data, file = 'preproc_nuclear_weapon_tests.csv')
