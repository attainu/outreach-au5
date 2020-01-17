var express = require('express')
var app = express()
var cities = require('indian-cities-json')
var hbs = require('hbs')
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
    var cityName = []
    cityName.push(cities)
    var names = []
    for(i=0; i<1221; i++){
        var x = cityName[0].cities[i].name
        names.push(x)
    }
   res.render("signup", {
       data:names
   })
})


app.listen(3000)