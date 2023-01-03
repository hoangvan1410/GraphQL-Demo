var { buildSchema } = require('graphql');
var { userService} = require('./service/user.service')
var schema = buildSchema(`
    type Query {
        user(id: Int!): User
        getUser: [User]
    },

    type User {
        uuid: String,
        mail: String,
        userName: String
    }
`);

var getUser = function() { 
    return userService.getAllUser()
}

var getCourses = function(args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

var updateCourseTopic = function({id, topic}) {
    coursesData.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });
    return coursesData.filter(course => course.id === id) [0];
}
var root = {
    users: getUser
    // courses: getCourses,
    // updateCourseTopic: updateCourseTopic
};

module.exports = {schema,root}