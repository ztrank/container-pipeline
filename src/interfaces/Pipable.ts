import { Observable } from 'rxjs';
import { Container } from 'inversify';

export interface Pipable {
    pipe(container: Container): Observable<Container>;
}