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
            <p>Hello World!</p>
            <h3>ID: {note}</h3>
            <p>Data: {data}</p>
        </div>
    );
}



export default Note;
