import { Pipeline } from '../interfaces/Pipeline';
import { Pipable } from '../interfaces/Pipable';
import { interfaces, Container, injectable } from 'inversify';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

type PipableSymbol = string | symbol | interfaces.Newable<Pipable> | interfaces.Abstract<Pipable>;

@injectable()
export class PipelineImpl implements Pipeline {
    private pipables: PipableSymbol[] = [];

    public constructor() {}

    public add(pipable: PipableSymbol): void {
        this.pipables.push(pipable);
    }

    public execute(container: Container): Observable<Container> {
        return this.executeOne(0, container);
    }

    private executeOne(index: number, container: Container): Observable<Container> {
        const pipableSym = this.pipables.length <= index ? undefined : this.pipables[index];
        if(!pipableSym) {
            return of(container);
        }
        const pipable = container.get<Pipable>(pipableSym);
        return pipable.pipe(container)
            .pipe(
                mergeMap((container: Container) => this.executeOne(index + 1, container))
            )
    }
}