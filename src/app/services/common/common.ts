import { finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';

export function withLoader(loader: LoaderService) {
    loader.showLoader();
    return finalize(() => {
        loader.hideLoader()
    });
}