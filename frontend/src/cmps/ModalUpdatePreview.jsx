import React from "react"
import moment from "moment"
import AccessTimeIcon from '@mui/icons-material/AccessTime';





export const ModalUpdatePreview = ({ comment, onRemoveComment, getInitials, imgUrl }) => {


    return (
        <div className="update-preview">
            <div className="main-section " >
                <div className="member flex align-center" >
                    {/* <span><Avatar alt={comment.byMember.username} src={comment.byMember.imgUrl} style={{ width:'30px', height:'30px', display:'inline-block' }}/></span> */}
                    {/* <div className="member-img">{getInitials(comment.byMember.fullname)}</div> */}
                    <div className='member-img'>
                        {imgUrl ? <img src={imgUrl} alt="" />
                            : getInitials(comment.byMember.fullname)}
                    </div>
                    <span>{comment.byMember.fullname}</span>
                </div>
                <div className="info-and-actions">
                    <span className="fa clock"></span>
                    <span> {moment(comment.createdAt).fromNow()} </span>
                    <span className="fa-solid times" onClick={() => onRemoveComment(comment)}></span>
                </div>
                <p className="comment-txt" >{comment.txt}</p>
                {/* {imgUrl && <img className="uploaded-img" src={imgUrl} alt='img'></img>} */}
            </div>
            <div className="update-like-container" >
                <div className="like-update"><span className="fa-solid thumbs-up"></span><span>Like</span></div>
                <div className="comment-update"><span className="fa-solid reply"></span><span>Reply</span></div>
            </div>
        </div>
    )
}