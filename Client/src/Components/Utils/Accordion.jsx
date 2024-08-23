// AccordionComponent.js
import React from 'react';
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";

export const AccordionComponent = ({ open, handleOpen, joinedCommunities, otherCommunities, handleChatClick }) => {
    return (
        <>
            <Accordion open={true} className="mb-2 rounded-lg px-4">
                <AccordionHeader
                    onClick={() => handleOpen(1)}
                    className={`border-b-0 transition textgray poppins text-lg font-semibold`}
                >
                    Joined
                </AccordionHeader>
                <AccordionBody className="pt-0 text-base font-normal">
                    {joinedCommunities.length > 0 ? joinedCommunities.map(community => (
                        <div key={community._id} className='flex items-center p-2 hover:bg-gray-100 rounded-lg transition hover:cursor-pointer' onClick={() => handleChatClick(community)}>
                            <img
                                className="w-16 h-16 border rounded-full mr-2"
                                src={community.profileImg}
                                alt="Profile"
                            />
                            <h1 className='poppins text-md'>{community.name}</h1>
                        </div>
                    )) : (
                        <p>No joined groups</p>
                    )}
                </AccordionBody>
            </Accordion>

            <Accordion open={open === 2} className="mb-2 rounded-lg border border-blue-gray-100 bg-gray-50 px-4">
                <AccordionHeader
                    onClick={() => handleOpen(2)}
                    className={`border-b-0 textgray poppins text-lg font-semibold transition-colors ${open === 2 ? "text-blue-700 hover:!text-blue-800" : ""}`}
                >
                    Others
                </AccordionHeader>
                <AccordionBody className="pt-0 text-base font-normal">
                    {otherCommunities.length > 0 ? otherCommunities.map(community => (
                        <div key={community._id} className='flex items-center p-2 hover:bg-gray-100 rounded-lg transition hover:cursor-pointer' onClick={() => handleChatClick(community)}>
                            <img
                                className="w-16 h-16 border rounded-full mr-2"
                                src={community.profileImg}
                                alt="Profile"
                            />
                            <h1 className='poppins text-md'>{community.name}</h1>
                        </div>
                    )) : (
                        <p>No other groups</p>
                    )}
                </AccordionBody>
            </Accordion>
        </>
    );
};
