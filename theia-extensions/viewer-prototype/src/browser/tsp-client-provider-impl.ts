import { injectable, inject } from 'inversify';
import { ExperimentManager } from 'traceviewer-base/lib/experiment-manager';
import { TraceManager } from 'traceviewer-base/lib/trace-manager';
import { ITspClientProvider } from 'traceviewer-base/lib/tsp-client-provider';
import { TspFrontendClient } from 'traceviewer-base/lib/tsp-frontend-client';

@injectable()
export class TspClientProvider implements ITspClientProvider {
    private _tspClient: TspFrontendClient;
    private _traceManager: TraceManager;
    private _experimentManager: ExperimentManager;
    private _listeners: ((tspClient: TspFrontendClient) => void)[];

    constructor(@inject(TspFrontendClient) protected client: TspFrontendClient) {
        this._tspClient = client;
        this._traceManager = new TraceManager(this._tspClient);
        this._experimentManager = new ExperimentManager(this._tspClient, this._traceManager);
        this._listeners = [];
    }

    public getTspClient(): TspFrontendClient {
        return this._tspClient;
    }

    public getTraceManager(): TraceManager {
        return this._traceManager;
    }

    public getExperimentManager(): ExperimentManager {
        return this._experimentManager;
    }

    /**
     * Add a listener for trace server url changes
     * @param listener The listener function to be called when the url is
     * changed
     */
    addTspClientChangeListener(listener: (tspClient: TspFrontendClient) => void): void {
        this._listeners.push(listener);
    }
}
