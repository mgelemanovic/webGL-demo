module.exports = function (grunt) {
    grunt.initConfig({
        // Define source files and their destination
        uglify: {
            files: {
                src: ['src/core/**/*.js', 'src/game/*.js', 'src/game/objects/game-object.js',
                'src/game/objects/rigidbody.js', 'src/game/objects/*.js', 'src/game.js'],
                dest: 'dist/game.min.js'
            }
        },
        watch: {
            js: {files: 'src/**/*.js', tasks: ['uglify']},
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Register at least this one task
    grunt.registerTask('default', ['uglify']);
};
