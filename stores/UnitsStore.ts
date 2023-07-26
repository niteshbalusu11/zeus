import { action, observable } from 'mobx';
import SettingsStore from './SettingsStore';
import FiatStore from './FiatStore';
import FeeUtils from './../utils/FeeUtils';

type Units = 'sats' | 'BTC' | 'fiat';

// 100_000_000
export const SATS_PER_BTC = 100000000;

interface ValueDisplayProps {
    amount: string;
    unit: Units;
    symbol?: string;
    negative?: boolean;
    plural?: boolean;
    rtl?: boolean;
    space?: boolean;
}

export default class UnitsStore {
    @observable public units: Units = 'sats';
    settingsStore: SettingsStore;
    fiatStore: FiatStore;

    constructor(settingsStore: SettingsStore, fiatStore: FiatStore) {
        this.settingsStore = settingsStore;
        this.fiatStore = fiatStore;
    }

    @action
    public changeUnits = () => {
        const { settings } = this.settingsStore;
        const { fiatEnabled } = settings;

        if (!fiatEnabled) {
            this.units = this.units == 'sats' ? 'BTC' : 'sats';
        } else {
            switch (this.units) {
                case 'sats':
                    this.units = 'BTC';
                    break;
                case 'BTC':
                    this.units = 'fiat';
                    break;
                case 'fiat':
                    this.units = 'sats';
                    break;
            }
        }
    };

    @action
    public resetUnits = () => {
        this.units = 'sats';
    };

    @action getUnformattedAmount = (
        value: string | number = 0,
        fixedUnits?: string
    ): ValueDisplayProps => {
        const { settings } = this.settingsStore;
        const { fiat, display } = settings;
        const showAllDecimalPlaces: boolean =
            (display && display.showAllDecimalPlaces) || false;
        const units = fixedUnits || this.units;

        const sats = Number(value);
        const negative = sats < 0;
        const absValueSats = Math.abs(sats);

        if (units === 'BTC') {
            return {
                amount: FeeUtils.toFixed(
                    absValueSats / SATS_PER_BTC,
                    showAllDecimalPlaces
                ),
                unit: 'BTC',
                negative,
                space: false
            };
        } else if (units === 'sats') {
            return {
                amount: this.fiatStore.numberWithCommas(
                    absValueSats,
                    3
                ),
                unit: 'sats',
                negative,
                plural: !(Number(value) === 1 || Number(value) === -1)
            };
        } else {
            const currency = fiat;

            // TODO: is this the right place to catch this?
            if (!currency) {
                return {
                    amount: 'Disabled',
                    unit: 'fiat',
                    symbol: '$'
                };
            }

            if (this.fiatStore.fiatRates) {
                const fiatEntry = this.fiatStore.fiatRates.filter(
                    (entry: any) => entry.code === fiat
                )[0];

                if (!fiatEntry?.rate) {
                    return {
                        error: 'Rate for selected currency not available'
                    };
                }

                const rate = (fiatEntry && fiatEntry.rate) || 0;
                const { symbol, space, rtl, separatorSwap } =
                    this.fiatStore.getSymbol();

                const amount = (
                    FeeUtils.toFixed(absValueSats / SATS_PER_BTC) * rate
                ).toFixed(2);

                return {
                    amount: separatorSwap
                        ? this.fiatStore.numberWithDecimals(amount, 2)
                        : this.fiatStore.numberWithCommas(amount, 2),
                    unit: 'fiat',
                    symbol,
                    negative,
                    plural: false,
                    rtl,
                    space
                };
            } else {
                return { error: 'Error fetching fiat rates' };
            }
        }
    };

    @action
    public getAmount = (value: string | number = 0, fixedUnits?: string) => {
        const { settings } = this.settingsStore;
        const { fiat } = settings;
        const units = fixedUnits || this.units;

        const [wholeSats] = value.toString().split('.');
        if (units === 'BTC') {
            // handle negative values
            const valueToProcess = (wholeSats && wholeSats.toString()) || '0';
            if (valueToProcess.includes('-')) {
                const processedValue = valueToProcess.split('-')[1];
                return `-₿${FeeUtils.toFixed(
                    Number(processedValue) / SATS_PER_BTC
                )}`;
            }

            return `₿${FeeUtils.toFixed(
                Number(wholeSats || 0) / SATS_PER_BTC
            )}`;
        } else if (units === 'sats') {
            const sats = `${this.fiatStore.numberWithCommas(value, 3) || 0} ${
                Number(value) === 1 || Number(value) === -1 ? 'sat' : 'sats'
            }`;
            return sats;
        } else if (units === 'fiat' && fiat) {
            if (this.fiatStore.fiatRates) {
                const fiatEntry = this.fiatStore.fiatRates.filter(
                    (entry: any) => entry.code === fiat
                )[0];
                const { code } = fiatEntry;
                const rate = (fiatEntry && fiatEntry.rate) || 0;
                const { symbol, space, rtl, separatorSwap } =
                    this.fiatStore.symbolLookup(code);

                const amount = (
                    FeeUtils.toFixed(Number(wholeSats || 0) / SATS_PER_BTC) *
                    rate
                ).toFixed(2);

                const formattedAmount = separatorSwap
                    ? this.fiatStore.numberWithDecimals(amount, 2)
                    : this.fiatStore.numberWithCommas(amount, 2);

                if (rtl) {
                    return `${formattedAmount}${space ? ' ' : ''}${symbol}`;
                } else {
                    return `${symbol}${space ? ' ' : ''}${formattedAmount}`;
                }
            } else {
                return '$N/A';
            }
        }
    };
}
