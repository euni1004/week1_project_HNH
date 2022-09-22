function toggle_like(post_id, type) {
    console.log(post_id, type)
    let $a_like = $(`#${post_id} a[aria-label='heart']`)
    let $i_like = $a_like.find("i")
    if ($i_like.hasClass("fa-heart")) {
        $.ajax({
            type: "POST", url: "/update_like", data: {
                post_id_give: post_id, type_give: type, action_give: "unlike"
            }, success: function (response) {
                console.log("unlike")
                $i_like.addClass("fa-heart-o").removeClass("fa-heart")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })
    } else {
        $.ajax({
            type: "POST", url: "/update_like", data: {
                post_id_give: post_id, type_give: type, action_give: "like"
            }, success: function (response) {
                console.log("like")
                $i_like.addClass("fa-heart").removeClass("fa-heart-o")
                $a_like.find("span.like-num").text(num2str(response["count"]))
            }
        })

    }
}

function post() {
    let comment = $("#textarea-post").val()
    let today = new Date().toISOString()
    $.ajax({
        type: "POST", url: "/posting", data: {
            comment_give: comment, date_give: today
        }, success: function (response) {
            $("#modal-post").removeClass("is-active")
            window.location.reload()
        }
    })
}

function time2str(date) {
    let today = new Date()
    let time = (today - date) / 1000 / 60  // 분

    if (time < 60) {
        return parseInt(time) + "분 전"
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전"
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전"
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function num2str(count) {
    if (count > 10000) {
        return parseInt(count / 1000) + "k"
    }
    if (count > 500) {
        return parseInt(count / 100) / 10 + "k"
    }
    if (count == 0) {
        return ""
    }
    return count
}

function get_posts(username) {
    if (username == undefined) {
        username = ""
    }
    $("#post-box").empty()
    $.ajax({
        type: "GET", url: `/get_posts?username_give=${username}`, data: {}, success: function (response) {
            if (response["result"] == "success") {
                let posts = response["posts"]
                for (let i = 0; i < posts.length; i++) {
                    let post = posts[i]
                    let time_post = new Date(post["date"])
                    let time_before = time2str(time_post)

                    let class_heart = post['heart_by_me'] ? "fa-heart" : "fa-heart-o"
                    let count_heart = post['count_heart']
                    let html_temp = `<div class="box" id="${post["_id"]}">
                                        <article class="media">
                                            <div class="media-left">
                                                <a class="image is-64x64" href="/user/${post['username']}">
                                                    <img class="is-rounded" src="/static/${post['profile_pic_real']}"
                                                         alt="Image">
                                                </a>
                                            </div>
                                            <div class="media-content">
                                                <div class="content">
                                                    <p>
                                                        <strong>${post['profile_name']}</strong> <small>@${post['username']}</small> <small>${time_before}</small>
                                                        <br>
                                                        ${post['comment']}
                                                    </p>
                                                </div>
                                                <nav class="level is-mobile">
                                                    <div class="level-left">
                                                        <a class="level-item is-sparta" aria-label="heart" onclick="toggle_like('${post['_id']}', 'heart')">
                                                            <span class="icon is-small"><i class="fa ${class_heart}"
                                                                                           aria-hidden="true"></i></span>&nbsp;<span class="like-num">${num2str(count_heart)}</span>
                                                        </a>
                                                    </div>

                                                </nav>
                                            </div>
                                        </article>
                                    </div>`
                    $("#post-box").append(html_temp)
                }
            }
        }
    })
}

function get_food_posts() {
    $("#main-card").empty()
    $.ajax({
        type: "GET", url: `/get_foodposts`, data: {}, success: function (response) {
            console.log(response)
            if (response["result"] == "success") {
                let foodlocs = response["foodlocs"]
                for (let i = 0; i < foodlocs.length; i++) {
                    let foodloc = foodlocs[i]
                    let time_post = new Date(foodloc["date"])
                    let time_before = time2str(time_post)
                    let comment = foodloc['food_comment'].substring(0, 21)
                    let html_temp = ""
                    if (foodloc['food_comment'].length > 20) {
                        html_temp = `<div class="card">
                                        <div class="card-image">
                                            <a class="image is-4by3" href="/foodcontent/${foodloc['date']}">
                                                <img src="/static/${foodloc['food_file']}" alt="Placeholder image">
                                            </a>
                                        </div>
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <a class="image is-48x48" href="/user/${foodloc['username']}">
                                                        <img src="/static/${foodloc['profile_pic_real']}" alt="Placeholder image">

                                                    </a>
                                                </div>
                                                <div class="media-content">
                                                    <a class="title is-4"href="/user/${foodloc['username']}">${foodloc['profile_name']}</a><br>
                                                    <a class="subtitle is-6"  href="/user/${foodloc['username']}">@${foodloc['username']}</a>
                                                    
                                                </div>
                                            </div>
                                            <a href="/foodcontent/${foodloc['date']}" style="color: black">🍚&emsp;${foodloc['food_name']}<br>
                                            <a href="/foodcontent/${foodloc['date']}" style="color: black">📄&emsp;${comment}</a> <br>
                                            <time datetime="2016-1-1">${time_before}</time>
                                        </div>
                                    </div>`
                    } else {
                        html_temp = `<div class="card">
                                        <div class="card-image">
                                            <a class="image is-4by3" href="/foodcontent/${foodloc['date']}">
                                                <img src="/static/${foodloc['food_file']}" alt="Placeholder image">
                                            </a>
                                        </div>
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <a class="image is-48x48" href="/user/${foodloc['username']}">
                                                        <img src="/static/${foodloc['profile_pic_real']}" alt="Placeholder image">
        
                                                    </a>
                                                </div>
                                                <div class="media-content">
                                                    <a class="title is-4"href="/user/${foodloc['username']}">${foodloc['profile_name']}</a><br>
                                                    <a class="subtitle is-6"  href="/user/${foodloc['username']}">@${foodloc['username']}</a>
                                                    
                                                </div>
                                            </div>
                                            <a href="/foodcontent/${foodloc['date']}" style="color: black">🍚&emsp;${foodloc['food_name']}<br>
                                            <a href="/foodcontent/${foodloc['date']}" style="color: black">📄&emsp;${foodloc['food_comment']}</a> <br><br>
                                            <time datetime="2016-1-1">${time_before}</time>
                                        </div>
                                    </div>`
                    }
                    $("#main-card").append(html_temp)
                }
            }
        }
    })
}

function get_movie_posts() {
    $("#main-card").empty()
    $.ajax({
        type: "GET", url: `/get_movieposts`, data: {}, success: function (response) {
            console.log(response)
            if (response["result"] == "success") {
                let movies = response["movies"]
                for (let i = 0; i < movies.length; i++) {
                    let movie = movies[i]
                    let time_post = new Date(movie["date"])
                    let time_before = time2str(time_post)
                    let comment = movie['movie_comment'].substring(0, 21)
                    let html_temp = ""
                    if (movie['movie_comment'].length > 20) {
                        html_temp = `<div class="card">
                                        <div class="card-image">
                                            <a class="image is-4by3" href="/moviecontent/${movie['date']}">
                                                <img src="/static/${movie['movie_file']}" alt="Placeholder image">
                                            </a>
                                        </div>
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <a class="image is-48x48" href="/user/${movie['username']}">
                                                        <img src="/static/${movie['profile_pic_real']}" alt="Placeholder image">

                                                    </a>
                                                </div>
                                                <div class="media-content">
                                                    <a class="title is-4"href="/user/${movie['username']}">${movie['profile_name']}</a><br>
                                                    <a class="subtitle is-6"  href="/user/${movie['username']}">@${movie['username']}</a>
                                                    
                                                </div>
                                            </div>
                                                <a href="/moviecontent/${movie['date']}" style="color: black">🎬&emsp;${movie['movie_name']}<br>
                                                <a href="/moviecontent/${movie['date']}" style="color: black">📄&emsp;${comment}...<br>
                                            <time datetime="2016-1-1">${time_before}</time>
                                        </div>
                                    </div>`
                    } else {
                        html_temp = `<div class="card">
                                        <div class="card-image">
                                            <a class="image is-4by3" href="/moviecontent/${movie['date']}">
                                                <img src="/static/${movie['movie_file']}" alt="Placeholder image">
                                            </a>
                                        </div>
                                        <div class="card-content">
                                            <div class="media">
                                                <div class="media-left">
                                                    <a class="image is-48x48" href="/user/${movie['username']}">
                                                        <img src="/static/${movie['profile_pic_real']}" alt="Placeholder image">

                                                    </a>
                                                </div>
                                                <div class="media-content">
                                                    <a class="title is-4"href="/user/${movie['username']}">${movie['profile_name']}</a><br>
                                                    <a class="subtitle is-6"  href="/user/${movie['username']}">@${movie['username']}</a>
                                                    
                                                </div>
                                            </div>
                                                <a href="/moviecontent/${movie['date']}" style="color: black">🎬&emsp;${movie['movie_name']}<br>
                                                <a href="/moviecontent/${movie['date']}" style="color: black">📄&emsp;${movie['movie_comment']}<br><br>
                                            <time datetime="2016-1-1">${time_before}</time>
                                        </div>
                                    </div>`
                    }

                    $("#main-card").append(html_temp)
                }
            }
        }
    })
}

