import { program } from 'commander';
import { JsonRpcProvider, formatAddress, testnetConnection } from '@mysten/sui.js';
import { fetchKiosk, getKioskObject, queryTransferPolicy } from '@mysten/kiosk';
import inquirer from 'inquirer';

const provider = new JsonRpcProvider(testnetConnection);

program
    .name('kiosk-cli')
    .description('Simple CLI to interact with Kiosk smart contracts')
    .version('0.0.1');

program
    .command('lookup')
    .description('Look up a Kiosk by ID')
    .argument('<ID>', 'ID of the Kiosk to look up')
    .action(getKiosk);

program
    .command('listings')
    .description('List all Kiosk listings')
    .argument('<ID>', 'ID of the Kiosk to look up')
    .action(getListings);

program.parse();

const EXIT_OPTION = '>> no option - exit';

async function getKiosk(id: string) {
    const kiosk = await getKioskObject(provider, id)
        .catch((err) => ({ err }));

    if ('err' in kiosk) {
        return console.log('Error: %s', kiosk.err);
    }

    console.log('Kiosk found!');
    console.log(JSON.stringify(kiosk, null, 2));
}

async function getListings(id: string) {
    const { data: { listings } } = await fetchKiosk(provider, id, { limit: 1000 }, {
        withListingPrices: true,
    });

    console.table(listings.map((listing) => ({ ...listing, listingId: formatAddress(listing.listingId) })));

    await inquirer.prompt([
        {
            type: 'list',
            message: 'Select an item to view',
            name: 'itemId',
            choices: listings.map((listing) => listing.itemId).concat(EXIT_OPTION),
        },
    ]).then(async ({ itemId }) => {
        if (itemId === EXIT_OPTION) {
            return;
        }

        // here we know that the item exists - it's in the Kiosk.
        const item = await provider.getObject({
            id: itemId,
            options: { showDisplay: true, showType: true }
        });

        // type always exists; display may not exist
        const type = item.data?.type!;
        const display = item.data?.display?.data;
        const policy = await queryTransferPolicy(provider, type);

        console.log('Item details:');
        console.log('Type: %s', type.split('<').join('<\n    '));
        console.log('Display: %s', JSON.stringify(display, null, 2));
        console.log('Transfer Policy: %s', JSON.stringify(policy, null, 2))
    })
}
