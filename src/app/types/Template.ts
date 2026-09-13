type Template = {
    id : number,
    heading : string,
    isUserForeground: 0|1,
    celebrityIDs: string,
    src : string,
    srcPreview : string,
    info?:string,
    infoTitle?:string,
    infoText?:string
}

type wishesList={
    id:number,
    wishText:string
}

type sloganList={
    id:number,
    sloganText:string
}

export type {
    Template,
    wishesList,
    sloganList
}