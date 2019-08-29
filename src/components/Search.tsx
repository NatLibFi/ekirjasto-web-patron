
import * as React from "react";
import styled from "styled-components"

const SearchForm = styled.form.attrs(props => ({
    role: "search"
}))`
    display: inline-block;
    position: absolute;
    bottom: 20px;
    right: 20px;
`

const SearchInput = styled.input.attrs(props => ({
    type: "text",
    name: "search",
    title: "Search",
    placeholder: "Search"
}))`
    border-radius: 10px;
    border-color: #343434;
    padding: 8px;
    border-width: 1px;
`

const SearchButton = styled.button.attrs(props => ({
    type: "submit"
}))`
    -webkit-appearance: none;
    background: #343434;
    color: white;
    border: none;
    padding: 10px;
    margin-left: 20px;
    border-radius: 10px;
    text-transform: uppercase;
    font-size: 0.9em;
    font-weight: bold;

`

export const Search = (props) => {

    return <SearchForm>
        <SearchInput />
        <SearchButton>Search</SearchButton>
    </SearchForm>

}