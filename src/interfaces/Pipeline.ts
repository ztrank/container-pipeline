import { Pipable } from './Pipable';
import { Container, interfaces } from 'inversify';
import { Observable } from 'rxjs';

export interface Pipeline {
    add(pipable: string | symbol | interfaces.Newable<Pipable> | interfaces.Abstract<Pipable>): void;
    execute(container: Container): Observable<Container>;
}