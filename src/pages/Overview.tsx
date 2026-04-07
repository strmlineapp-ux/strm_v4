import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

export default function Overview() {
  return (
    <div className="p-8">
      {/* Seamless headerless layout setup */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Demonstrating the Masonry Draggable layout standard requirement (Bento removed) */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome Page</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm">Masonry collection area placeholder</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
