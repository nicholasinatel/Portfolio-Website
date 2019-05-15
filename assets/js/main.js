var chart = 0;

var data = {
    // A labels array that can contain any sort of values
    labels: [],
    // Our series array that contains series objects or in this case series data arrays
    series: [
        []
    ]
};
var options = {
    showPoint: true,
    lineSmooth: true,
    axisX: {
        offset: 50,
        showGrid: true,
        showLabel: true,
        labelInterpolationFnc: function (value) {
            return value;
        }
    },
    axisY: {
        onlyInteger: true,
        lineSmooth: Chartist.Interpolation.step(),
        offset: 60,
        labelInterpolationFnc: function (value) {
            return value + ' Hours';
        }
    },
    lineSmooth: Chartist.Interpolation.step(),
    showArea: true,
    showPoint: false,
    low: 0
};

var responsiveOptions = [
    ['screen and (max-width: 640px)', {
        showGrid: false,
        axisX: {
            labelInterpolationFnc: function (value) {
                return "";
            }
        },
        axisY: {
            offset: 30,
            labelInterpolationFnc: function (value) {
                return value + ' H';
            }
        }
    }]
];


$(function () {
    //Second Graphic
    var chart2 = new Chartist.Bar('.ct-chart-2', {
        labels: ['HTML5',
            'CSS3/Bootstrap',
            'JavaScript/jQuery',
            'Responsive Web Design/Web Images',
            'SEO',
            'React',
            'Python',
            'Linux-Servers',
            'Flask',
            'Vagrant',
            'SQLAlchemy',
            'MYSQL',
            'sqlite3',
            'psycopg2',
            'PostgreSQL',
            'Node.js',
            'Hapi',
            'Heroku',
            'PM2',
            'Mocha',
            'Docker',
            'AWS',
            'Istanbul',
            'MongoDB',
            'PHP',
            'Git Control',
            'Agile Workflow'],
        series: [
            [5, 5, 5, 5, 3, 1, 1, 3, 2, 2, 1, 1, 5, 3]
        ]
    }, {
            seriesBarDistance: 10,
            reverseData: true,
            horizontalBars: true,
            high: 5,
            low: 0,
            axisX: {
                onlyInteger: true
            },
            axisY: {
                offset: 120
            }
        });
        
    //chart2 animation handler
    var seq2 = 0;
    //chart2 animation
    chart2.on('draw', function (data) {
        if (data.type === 'bar') {
            data.element.animate({
                opacity: {
                    begin: (seq2++ * 250),
                    dur: 2500,
                    from: 0,
                    to: 1
                }
            });
        }
    });

    //Chart 1 Animation Handlers
    var seq = 0,
        delays = 15,
        durations = 50;
    // First Graphic
    $.ajax({
        type: 'GET',
        url: 'https://wakatime.com/share/@nicholaslobobr/7fc297e1-5ad0-40dd-a5c4-1d54bc56f94c.json',
        dataType: 'jsonp',
        success: function (response) {
            // console.log(response.data);
            // console.log("Checking inside access data: ");
            // console.log(response.data[0].grand_total.digital);
            // console.log(response.data[0].range.date)
            for (i = 0; i < 30; i++) {
                data.labels[i] = response.data[i].range.date;
                data.labels[i] = data.labels[i].replace("2018-", "");
                response.data[i].grand_total.digital = response.data[i].grand_total.digital.replace(":", ".");
                var number = parseFloat(response.data[i].grand_total.digital)
                data.series[0][i] = number; //Math.ceil(number);
            }
            console.log(data.labels);
            console.log(data.series);
            chart = new Chartist.Line('.ct-chart', data, options, responsiveOptions);
            chart.on('draw', function (data) {
                seq++;
                if (data.type === 'line') {
                    // If the drawn element is a line we do a simple opacity fade in. This could also be achieved using CSS3 animations.
                    data.element.animate({
                        opacity: {
                            // The delay when we like to start the animation
                            begin: seq * delays + 10,
                            // Duration of the animation
                            dur: durations * 50,
                            // The value where the animation should start
                            from: 0.25,
                            // The value where it should end
                            to: 1
                        }
                    });
                } else if (data.type === 'label' && data.axis === 'x') {
                    data.element.animate({
                        y: {
                            begin: seq * delays,
                            dur: durations,
                            from: data.y + 100,
                            to: data.y,
                            // We can specify an easing function from Chartist.Svg.Easing
                            easing: 'easeOutQuart'
                        }
                    });
                } else if (data.type === 'label' && data.axis === 'y') {
                    data.element.animate({
                        x: {
                            begin: seq * delays,
                            dur: durations,
                            from: data.x - 100,
                            to: data.x,
                            easing: 'easeOutQuart'
                        }
                    });
                } else if (data.type === 'area') {
                    data.element.animate({
                        opacity: {
                            // The delay when we like to start the animation
                            begin: seq++,
                            // Duration of the animation
                            dur: durations * 500,
                            // The value where the animation should start
                            from: 0.5,
                            // The value where it should end
                            to: 1
                        }
                    });
                } else if (data.type === 'grid') {
                    // Using data.axis we get x or y which we can use to construct our animation definition objects
                    var pos1Animation = {
                        begin: 1 * seq,
                        dur: durations - 35,
                        from: data[data.axis.units.pos + '1'] - 150,
                        to: data[data.axis.units.pos + '1'],
                        easing: 'easeOutQuart'
                    };

                    var pos2Animation = {
                        begin: 1 * seq,
                        dur: durations - 35,
                        from: data[data.axis.units.pos + '2'] - 5000,
                        to: data[data.axis.units.pos + '2'],
                        easing: 'easeOutQuart'
                    };

                    var animations = {};
                    animations[data.axis.units.pos + '1'] = pos1Animation;
                    animations[data.axis.units.pos + '2'] = pos2Animation;
                    animations['opacity'] = {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'easeOutQuart'
                    };

                    data.element.animate(animations);
                }
            });
            // Chart Reset Animation
            chart.on('created', function () {
                seq = 0;
                seq2 = 0;
                if (window.__anim0987432598723) {
                    clearTimeout(window.__anim0987432598723);
                    window.__anim0987432598723 = null;
                }
                window.__anim0987432598723 = setTimeout(chart2.update.bind(chart2), 8000);
                window.__anim0987432598723 = setTimeout(chart.update.bind(chart), 7000);
            });
        }
    });
});
