





class Annotation {
    id: string;

    
    
}




class CodeAnnotation extends Annotation {
    code: string;
    fragment: Fragment;

    constructor(id: string, fragment: Fragment, code: string) {
        super();
        this.id = id;
        this.fragment = fragment;
        this.code = code;
    }

    getCode() : string {
        return this.code;
    }

    getFragment() : Fragment {
        return this.fragment;
    }
}