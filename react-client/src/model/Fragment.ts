
import { Annotation } from "./Annotation.ts";
import { Document } from "./Document.ts";

class Fragment {
    id: string;
    document: Document;
    selector: string;
    content: string;
    annotations: Annotation[];

    constructor(id: string, document: Document, selector: string, content: string, annotations: Annotation[]) {
        this.id = id;
        this.selector = selector;
        this.document = document;
        this.content = content;
        this.annotations = annotations;
    }

    getSelector() : string {
        return this.selector;
    }

    getAnnotations() : Annotation[] {
        return this.annotations;
    }

    addAnnotation(annotation: Annotation) {
        this.annotations.push(annotation);
    }

    removeAnnotation(annotation: Annotation) {
        this.annotations = this.annotations.filter(ann => ann.id !== annotation.id);
    }

    getContent() : any {
        return this.content;
    }

    getDocument() : Document {
        return this.document;
    }
}


export default Fragment;