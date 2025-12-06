import { BrowserProvider, Contract } from 'ethers';
import ChatABI from '../contracts/ChatABI.json';

export const CONTRACT_ADDRESS = '0x249520318349Da50ff684c13f56668e30F4DB4eF';

export const getChatContract = async () => {
  if (!window.ethereum) throw new Error('No Metamask');

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new Contract(CONTRACT_ADDRESS, ChatABI, signer);

  return { contract, signer };
};
