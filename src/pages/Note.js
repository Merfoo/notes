/** @jsx jsx */

import { css, jsx } from "@emotion/core";

import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";


const GETNOTE = gql`
    query  {
        notes {
        id
        title
        titleId
        createdBy{
            username
        }
        body
        }
    }
`;

function Note({match}) {
    const { data, loading, error } = useQuery(GETNOTE);
    console.log(data);

    const note = match.params.id;


    return (
        <div>
            <p>View Single Note Page</p>
        </div>
    );
}



export default Note;
