import React from 'react';
import './Task.scss';

function Task(){
    return (
        <ul className="task-list">
              <li className="task-item">
                <img src="https://trungquandev.com/wp-content/uploads/2021/06/mern-stack-trungquandev-youtube-thumnail-awesome-course.png" 
                    alt="Default"></img>
                    Title: This is an image
              </li>
              <li className="task-item">Add whatever you like!</li>
              <li className="task-item">Add whatever you like!</li>
              <li className="task-item">Add whatever you like!</li>
              <li className="task-item">Add whatever you like!</li>
              <li className="task-item">Add whatever you like!</li>
              <li className="task-item">Add whatever you like!</li>
              <li className="task-item">Add whatever you like!</li>
              <li className="task-item">Add whatever you like!</li>
              <li className="task-item">Add whatever you like!</li>
        </ul>
    );
}

export default Task;
