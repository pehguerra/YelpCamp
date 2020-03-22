const mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    faker = require('faker/locale/en');

var data = [];

for (i = 0; i < 3; i++) {
    data.push({
        name: faker.company.companyName(),
        image: faker.image.nature(),
        description: faker.lorem.paragraphs()
    });
}

seedDB = () => {
    Campground.deleteMany({}, (err) => {
        if(err) {
            console.log(err);
        } else {
            Comment.deleteMany({}, (err) => {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Removed Comments!");
                }
            });
            console.log("Removed Campgrounds!");
            // add a few campgrounds
            data.forEach((seed) => {
                Campground.create(seed, (err, campground) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Added a Campground!")
                        // add a few comments
                        Comment.create({
                            text: faker.lorem.words(300),
                            author: faker.fake("{{name.firstName}} {{name.lastName}}")
                        }, (err, comment) => {
                            if (err) {
                                console.log(err)
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;