import React from 'react';

const Info = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16px"
            height="16px"
            className={className}
        >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
                fill="#3464c8" /* Color for the info icon */
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11h2v2h-2zm0 4h2v6h-2z"
            />
        </svg>
    );
};

export default Info;
