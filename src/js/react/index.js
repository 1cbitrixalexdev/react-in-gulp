import React from 'react'
import ReactDOM from 'react-dom'
import Toast from './components/Toast'

ReactDOM.render(
    <Toast toastHeading="Стас"
           toastImgSrc="/img/stas.jpg"
           toastImgAlt="Стас Пономарёв"
           toastSmallText="онлайн"
           toastBody="Привет! React запустил этот тост..."/>,
    document.getElementById('toast')
)