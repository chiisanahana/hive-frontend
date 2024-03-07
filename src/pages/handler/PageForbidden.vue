<template>
    <!-- <h1>Oops</h1>
    <h3>Page Not Found</h3> -->

    <div id="forbidden">
        <div class="forbidden">
            <div class="forbidden-403">
                <h1>403</h1>
            </div>
            <h2>Access Denied</h2>
            <p>We are sorry, but you do not have access to this page or resource.</p>
            <a href="/">Back To Homepage</a>
        </div>
    </div>
</template>

<style>
* {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

body {
    padding: 0;
    margin: 0;
    background-color: #FFFFFF !important;
}

#forbidden {
    position: relative;
    height: 100vh;
}

#forbidden .forbidden {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.forbidden {
    max-width: 920px;
    width: 100%;
    line-height: 1.4;
    text-align: center;
    padding-left: 15px;
    padding-right: 15px;
}

.forbidden .forbidden-403 {
    position: absolute;
    height: 100px;
    top: 0;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    z-index: -1;
}

.forbidden .forbidden-403 h1 {
    font-family: 'Maven Pro', sans-serif;
    color: #ececec;
    font-weight: 900;
    font-size: 276px;
    margin: 0px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.forbidden h2 {
    font-family: 'Maven Pro', sans-serif;
    font-size: 46px;
    color: #000;
    font-weight: 900;
    text-transform: uppercase;
    margin: 0px;
}

.forbidden p {
    font-family: 'Maven Pro', sans-serif;
    font-size: 16px;
    color: #000;
    font-weight: 400;
    text-transform: uppercase;
    margin-top: 15px;
}

.forbidden a {
    font-family: 'Maven Pro', sans-serif;
    font-size: 14px;
    text-decoration: none;
    text-transform: uppercase;
    background: #608CF8;
    display: inline-block;
    padding: 16px 38px;
    border: 2px solid transparent;
    border-radius: 40px;
    color: #FFFFFF;
    font-weight: 400;
    -webkit-transition: 0.2s all;
    transition: 0.2s all;
}

.forbidden a:hover {
    background-color: #ECF1FF;
    border-color: #86A7FC;
    color: #86A7FC;
}

@media only screen and (max-width: 480px) {
    .forbidden .forbidden-403 h1 {
        font-size: 162px;
    }

    .forbidden h2 {
        font-size: 26px;
    }
}
</style>