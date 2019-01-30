import React, {Component} from "react"

export default class Toast extends Component {
    render() {
        const a = this.props
        return (
            <div className="toast fade show">
                <div className="toast-header">
                    <img src={a.toastImgSrc}
                         className="rounded mr-2"
                         alt={a.toastImgAlt} />
                    <strong className="mr-auto">{a.toastHeading}</strong>
                    <small>{a.toastSmallText}</small>
                    <button type="button"
                            className="ml-2 mb-1 close"
                            data-dismiss="toast"
                            aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="toast-body">
                    {a.toastBody}
                </div>
            </div>
        )
    }
}